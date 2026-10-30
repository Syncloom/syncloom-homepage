---
title: "Troubleshooting"
subtitle: "Common questions and what to check."
group: "Reference"
weight: 110
---
## I forgot my password

Use your **recovery key** on the sign-in screen's recovery option to unlock the vault, then set a new password in *Settings*. Without the recovery key the data cannot be decrypted.

## My security key stopped working after I moved the server

Security keys are bound to the host name in `PUBLIC_URL`. If the name changes, keys registered under the old name no longer work. Sign in with an authenticator app or a recovery code and register the key again.

## "Version conflict" or a file ending in `(conflict – …)`

Two devices changed the same file at the same time and the changes could not be merged automatically. Open both files, keep what you want, and delete the other. The history keeps every version.

## Uploads fail with *payload too large*

Either the account's **quota** is full (ask an administrator), or a chunk exceeded the 2 MiB request limit because a proxy rewrote the body. The bundled Caddy configuration works as shipped.

## Live updates do not arrive

Browsers use a gRPC-Web stream. Your reverse proxy must not buffer responses. In Caddy that is `flush_interval -1`, which the bundled `Caddyfile` sets. The green dot in the web app's sidebar shows the connection state.

## The web app shows a blank page

Open the browser console. The app needs WebAssembly and a strict Content-Security-Policy that allows `'wasm-unsafe-eval'`. Custom proxies that rewrite response headers can break it.
