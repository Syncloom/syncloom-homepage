import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';

const SHOTS = '/e2e/shots';
fs.mkdirSync(SHOTS, { recursive: true });

function track(page: Page) {
	const errors: string[] = [];
	page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
	page.on('console', (m) => m.type() === 'error' && errors.push('console: ' + m.text()));
	page.on('requestfailed', (r) => errors.push('request failed: ' + r.url()));
	return errors;
}
async function settle(page: Page) {
	// scroll through so reveal-on-scroll content is visible, then back to the top
	const h = await page.evaluate(() => document.body.scrollHeight);
	for (let y = 0; y < h; y += 500) {
		await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' as ScrollBehavior }), y);
		await page.waitForTimeout(60);
	}
	await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
	await page.waitForTimeout(700);
}

test('home page renders with working animations', async ({ page }) => {
	const errors = track(page);
	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toContainText('woven together');
	await page.waitForTimeout(3500); // let the hero drawing and typing run
	await page.screenshot({ path: `${SHOTS}/01-home-hero.png` });
	await expect(page.locator('#typed')).toContainText('docker compose up -d');
	await settle(page);
	await page.screenshot({ path: `${SHOTS}/02-home-full.png`, fullPage: true });
	// counters ran
	await expect(page.locator('[data-count="256"]')).toHaveText('256-bit');
	expect(errors, errors.join('\n')).toEqual([]);
});

test('home page in dark mode and on a phone', async ({ browser }) => {
	const dark = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1360, height: 900 } });
	const p = await dark.newPage();
	await p.goto('/');
	await p.waitForTimeout(3000);
	await p.screenshot({ path: `${SHOTS}/03-home-dark.png` });
	await dark.close();

	const phone = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
	const m = await phone.newPage();
	await m.goto('/');
	await m.waitForTimeout(3000);
	await m.screenshot({ path: `${SHOTS}/04-home-phone.png` });
	// no horizontal scrolling on a phone
	expect(await m.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
	await m.getByRole('button', { name: 'Menu' }).click();
	await expect(m.locator('#links')).toBeVisible();
	await m.screenshot({ path: `${SHOTS}/05-phone-menu.png` });
	await phone.close();
});

test('install, docs, imprint and privacy pages', async ({ page }) => {
	const errors = track(page);
	await page.goto('/install/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Install Syncloom');
	await settle(page);
	await page.screenshot({ path: `${SHOTS}/06-install.png`, fullPage: true });
	// code blocks must be readable: the text has to contrast with the block's own background
	await page.getByRole('tab', { name: 'macOS' }).click();
	for (const pre of await page.locator('.prose pre').all()) {
		if (!(await pre.isVisible())) continue;
		const [bg, fg] = await pre.evaluate((el) => { const lum = (c: string) => { const [r, g, b] = c.match(/[\d.]+/g)!.map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }; const opaque = (e: Element): string => { let n: Element | null = e; while (n) { const c = getComputedStyle(n).backgroundColor; if (!/rgba\(.*, 0\)|transparent/.test(c)) return c; n = n.parentElement; } return "rgb(255, 255, 255)"; }; return [lum(opaque(el)), lum(getComputedStyle(el.querySelector('code')!).color)]; });
		expect((Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05), "code block contrast").toBeGreaterThan(7);
	}
	// OS tabs switch
	await page.getByRole('tab', { name: 'Windows' }).click();
	await expect(page.getByText('has not been built or tested yet')).toBeVisible();
	await page.goto('/docs/encryption/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Encryption');
	await expect(page.locator('.docs-toc nav a').first()).toBeVisible();
	await page.screenshot({ path: `${SHOTS}/07-docs.png` });
	await page.goto('/docs/configuration/');
	await page.screenshot({ path: `${SHOTS}/08-docs-config.png` });
	await page.goto('/imprint/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Imprint');
	await page.screenshot({ path: `${SHOTS}/09-imprint.png` });
	await page.goto('/privacy/');
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy policy');
	expect(errors.filter((e) => !/404/.test(e)), errors.join('\n')).toEqual([]);
});

test('every internal link and image resolves', async ({ page, request }) => {
	const seen = new Set<string>(['/']);
	const queue = ['/'];
	const broken: string[] = [];
	while (queue.length) {
		const url = queue.shift()!;
		await page.goto(url);
		const hrefs = await page.$$eval('a[href], img[src], link[rel="stylesheet"][href], script[src]', (els) => els.map((e) => (e as any).getAttribute('href') ?? (e as any).getAttribute('src')));
		for (const h of hrefs) {
			if (!h || h.startsWith('mailto:') || h.startsWith('#') || /^https?:\/\//.test(h)) continue;
			const path = h.split('#')[0];
			if (!path || seen.has(path)) continue;
			seen.add(path);
			const r = await request.get(path);
			if (r.status() >= 400) broken.push(`${url} -> ${h} (${r.status()})`);
			else if ((r.headers()['content-type'] ?? '').includes('text/html')) queue.push(path);
		}
	}
	console.log(`checked ${seen.size} internal URLs`);
	expect(broken, broken.join('\n')).toEqual([]);
});
