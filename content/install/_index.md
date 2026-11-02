---
title: "Install Syncloom"
subtitle: "Run the server with Docker in about five minutes, then build the apps."
description: "Install the Syncloom server with Docker Compose and set up the apps for Mac, iPhone, Linux, Windows and Android."
---

## 1. Run the server

The server is a single container next to Postgres. A bundled Caddy takes care of HTTPS certificates, and a web app container serves the browser interface.

<div class="req">
  <div><b>1 vCPU · 512 MB</b><span>enough for a family or a small team</span></div>
  <div><b>Docker 24+</b><span>with the Compose plugin</span></div>
  <div><b>A domain name</b><span>pointing at the machine, ports 80 and 443 open</span></div>
</div>

{{< steps >}}
1. **Get the deployment bundle**

   ```bash
   git clone https://github.com/Syncloom/syncloom-deploy.git
   cd syncloom-deploy
   ```

2. **Configure it**

   ```bash
   cp .env.example .env
   ```

   Set `SYNCLOOM_DOMAIN` to your host name and choose a strong `POSTGRES_PASSWORD`. Everything else is optional; see the [configuration reference](/docs/configuration/).

3. **Start everything**

   ```bash
   docker compose up -d
   ```

   Caddy obtains a Let's Encrypt certificate on first request. Check that all four containers are healthy with `docker compose ps`.

4. **Create the first account**

   Open `https://your-domain/`. The first account becomes the administrator. You will be shown your **recovery key** once, then asked to add a second factor, such as an authenticator app or a hardware security key.
{{< /steps >}}

{{< callout type="warning" title="Write down the recovery key" >}}
Syncloom encrypts your files with keys derived from your password. If you lose the password **and** the recovery key, your data cannot be recovered by anyone, including you or your administrator.
{{< /callout >}}

### Try it locally first

No domain yet? Use the plain-HTTP test stack on your laptop:

```bash
docker compose -f docker-compose.yml -f docker-compose.test.yml up -d
# then open http://localhost:8088
```

### Store files in S3 instead of a volume

Set these in `.env` and restart:

```ini
BLOB_BACKEND=s3
S3_BUCKET=syncloom
S3_REGION=eu-central-1
S3_ENDPOINT=https://s3.example.com   # omit for AWS
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
```

### Sign in with your identity provider

Syncloom speaks OpenID Connect. Register `https://your-domain/api/v1/auth/oidc/callback` as a redirect URI, then set `OIDC_ISSUER`, `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET`. Administrators pre-create SSO users in the admin panel, or you can enable `OIDC_AUTO_PROVISION`.

## 2. Install the apps

There are no pre-built downloads yet, so the apps are built from source. Every app signs in with your username, password and a second factor, then unlocks your vault locally.

{{< tabs >}}
{{< tab name="macOS" >}}
Build the app with Xcode and XcodeGen. Files appear in the Finder sidebar and download on demand.

```bash
git clone https://github.com/Syncloom/syncloom-apple.git
git clone https://github.com/Syncloom/syncloom-macos.git
cd syncloom-macos && xcodegen && open Syncloom.xcodeproj
```
{{< /tab >}}
{{< tab name="iPhone & iPad" >}}
Build the app with Xcode from `syncloom-ios` (same steps as for macOS). Your encrypted files show up in the Files app next to iCloud Drive. It has not been tested on a real device yet.
{{< /tab >}}
{{< tab name="Linux" >}}
The Linux client is a GTK4 app and a command-line client for servers. There are no packages yet, so build from source:

```bash
cargo install --git https://github.com/Syncloom/syncloom-linux syncloom
syncloom login https://your-domain you
syncloom daemon          # keeps ~/Syncloom in sync
```
{{< /tab >}}
{{< tab name="Windows" >}}
The Windows client (C# and WinUI 3) is in the repository `syncloom-windows`. It has been built and run on Windows 11 on ARM64; the x64 build has not been tried. There are no downloads yet, so build it from source with Rust, the .NET SDK and Visual Studio with the C++ tools (on ARM64 also clang); the README of the repository has the steps. Files are synced into a folder that Explorer knows as a sync root, but they are not yet on-demand placeholders.
{{< /tab >}}
{{< tab name="Android" >}}
Build the app from `syncloom-android` with Android Studio or `./gradlew assembleDebug`. It registers as a document provider, so your files appear in the system file picker. It has not been tested on a real device yet.
{{< /tab >}}
{{< tab name="Browser" >}}
Nothing to install. Open your server's address in any current browser. Files are decrypted locally with WebAssembly, and hardware security keys are supported.
{{< /tab >}}
{{< /tabs >}}


## 3. Add a spare second factor

Open **Settings → Two-step verification** and add a second authenticator or a spare security key. You can enrol as many as you like, and any one of them is enough to sign in.

## Updating

```bash
git pull
docker compose pull
docker compose up -d
```

Database migrations run automatically at startup. Back up the `pgdata` volume and the `files` folder first; see [Administration](/docs/administration/).
