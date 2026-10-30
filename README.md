# syncloom-homepage

The Syncloom website, built with [Hugo](https://gohugo.io) (extended). Hand-made layouts, no theme dependency, no build tooling beyond Hugo itself.

| Page | Source |
|---|---|
| Home (marketing) | `layouts/index.html`, `data/*.yaml` |
| Install | `content/install/_index.md` |
| Docs | `content/docs/*.md` (ordered by `weight`, grouped by `group`) |
| Imprint, Privacy | `content/imprint.md`, `content/privacy.md` |

The imprint and privacy pages carry the operator's real details. The site has no testimonials or download counts; keep it that way unless they are real.

## Develop

```bash
docker run --rm -it -p 1313:1313 -v "$PWD":/src hugomods/hugo:exts hugo server --bind 0.0.0.0
```

## Build and check

```bash
./run-e2e.sh        # builds the site and checks it in Chromium: screenshots, console errors, internal links
docker build -t syncloom-homepage . && docker run -p 8080:80 syncloom-homepage
```

Screenshots on the home page come from the web app's browser test (`syncloom-web/e2e`).
