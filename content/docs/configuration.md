---
title: "Configuration reference"
subtitle: "Every environment variable the server understands."
group: "Operating"
weight: 80
---
The server is configured with environment variables. In the Compose bundle they are set from `.env`.

## Core

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | *required* | PostgreSQL connection string, e.g. `postgres://syncloom:secret@db:5432/syncloom` |
| `LISTEN_ADDR` | `0.0.0.0:8080` | Address and port to bind |
| `PUBLIC_URL` | `http://localhost:8080` (local trials only) | The address users reach the service at, **including `https://` and a non-standard port if you use one**, e.g. `https://sync.example.com:7777`. In production always use `https://`: security keys only work on secure origins. The Docker Compose bundle sets it for you to `https://` plus `SYNCLOOM_DOMAIN`, so you normally never set it by hand. Security keys (WebAuthn) bind to its host name, and OIDC redirects use it. **Changing the host later invalidates registered security keys.** |
| `RUST_LOG` | `info,sqlx=warn` | Log filter |
| `MAINTENANCE_INTERVAL_SECS` | `3600` | How often retention and garbage collection run |
| `CORS_ORIGINS` | *(none)* | Comma-separated browser origins allowed for cross-origin development |

## Blob storage

| Variable | Default | Description |
|---|---|---|
| `BLOB_BACKEND` | `fs` | `fs` or `s3` |
| `BLOB_PATH` | `./data/blobs` | Directory for `fs` |
| `S3_BUCKET` | | Bucket name (required for `s3`) |
| `S3_REGION` | `us-east-1` | |
| `S3_ENDPOINT` | | Custom endpoint for S3-compatible stores (MinIO, Ceph, …) |
| `S3_ACCESS_KEY`, `S3_SECRET_KEY` | | Credentials (otherwise the default AWS credential chain is used) |

## Sign-in

| Variable | Default | Description |
|---|---|---|
| `LOCAL_AUTH` | `true` | Allow built-in accounts (password plus a second factor). Set `false` for OIDC only |
| `OIDC_ISSUER` | | Issuer URL of your identity provider |
| `OIDC_CLIENT_ID` | | |
| `OIDC_CLIENT_SECRET` | | |
| `OIDC_AUTO_PROVISION` | `false` | Create accounts automatically on first SSO sign-in |

## Compose bundle

| Variable | Description |
|---|---|
| `SYNCLOOM_DOMAIN` | Public host name; Caddy obtains a certificate for it. Add a port (`sync.example.com:7777`) to serve HTTPS on a non-standard port |
| `POSTGRES_PASSWORD` | Password for the bundled database |
| `SYNCLOOM_VERSION` | Image tag to run (default: the release of the bundle) |
| `SYNCLOOM_FILES_DIR` | Folder for the encrypted file chunks (default `./files` next to `docker-compose.yml`; ignored by Git) |
| `SYNCLOOM_HTTP_PORT` | Host port for port 80, which serves the redirect and the Let's Encrypt challenge (default `80`) |
| `SYNCLOOM_HTTP_BIND` | Address the HTTP port is published on (default `0.0.0.0`; e.g. `172.17.0.1` for the Docker bridge only) |
| `SYNCLOOM_HTTPS_PORT` | Host port for HTTPS (default `443`). **Must equal the port in `SYNCLOOM_DOMAIN`** |

Let's Encrypt always validates over port 80 of your domain. If another proxy owns port 80, forward it to `SYNCLOOM_HTTP_PORT` and keep the original `Host` header.
