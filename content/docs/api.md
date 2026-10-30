---
title: "API overview"
subtitle: "REST for everything, gRPC for the live change feed."
group: "Reference"
weight: 90
---
The API is JSON over HTTPS under `/api/v1`. Authenticate with `Authorization: Bearer <device token>`. Names, metadata, manifests and values are ciphertext, so the API is most conveniently used through a client library; the [Rust core](https://github.com/Syncloom/syncloom-core) implements all of it.

## Sign-in

```bash
# 1. fetch the key-derivation parameters (the same shape is returned for unknown users)
curl "https://sync.example.com/api/v1/auth/prelogin?username=alice"

# 2. send the derived login secret (never the password)
curl -X POST https://sync.example.com/api/v1/auth/login \
  -H 'content-type: application/json' \
  -d '{"username":"alice","auth_secret":"…","device_name":"my script"}'
# → { "status": "mfa_required", "token": "<short-lived>", "methods": ["totp","recovery"] }

# 3. prove a second factor
curl -X POST https://sync.example.com/api/v1/auth/mfa/verify \
  -H "authorization: Bearer <short-lived>" -H 'content-type: application/json' \
  -d '{"method":"totp","code":"123456","device_name":"my script"}'
# → { "status": "ok", "token": "<device token>" }
```

## Endpoints

| Area | Endpoints |
|---|---|
| Auth | `GET /auth/config`, `GET /auth/prelogin`, `POST /auth/register`, `POST /auth/login`, `POST /auth/mfa/verify`, `POST /auth/logout` |
| Second factors | `GET /me/mfa`, `PATCH`/`DELETE /me/mfa/{id}`, `POST /auth/totp/setup`, `POST /auth/totp/confirm`, `POST /auth/webauthn/register/{start,finish}`, `POST /auth/webauthn/login/{start,finish}`, `POST /me/recovery-codes` |
| Account | `GET /me`, `POST /me/password`, `GET /me/devices`, `DELETE /me/devices/{id}`, `GET /users/{name}/pubkey` |
| Tree | `GET /nodes?parent=`, `POST /nodes`, `GET`/`PATCH`/`DELETE /nodes/{id}`, `POST /nodes/{id}/restore`, `DELETE /trash/{id}`, `GET /shared` |
| Versions | `GET`/`POST /nodes/{id}/versions`, `GET`/`DELETE /versions/{id}` |
| Chunks | `POST /chunks/missing`, `PUT`/`GET /chunks/{hash}` |
| Changes | `GET /changes?since=`, `GET /changes/head` |
| Key/value | `GET /kv/{ns}/list`, `GET`/`PUT`/`DELETE /kv/{ns}/e/{key}` |
| Sharing | `POST`/`GET /shares`, `DELETE /shares/{id}`, `POST`/`GET /links`, `DELETE /links/{id}`, `GET /public/{token}…` |
| Admin | `GET /admin/users`, `PATCH`/`DELETE /admin/users/{id}`, `POST /admin/users/{id}/reset-2fa`, `POST /admin/invites`, `GET`/`PUT /admin/settings` |

### Optimistic concurrency

Creating a version includes `base_version`. If it is not the node's current head the server answers `409` with `{ "head_version": … }`, and the client must merge and retry.

## Live changes (gRPC)

```protobuf
service Sync {
  rpc Subscribe(SubscribeRequest) returns (stream Change);
}
message SubscribeRequest { int64 since = 1; }
message Change { int64 cursor = 1; string node_id = 2; string kind = 3; string version_id = 4; string kv_key = 5; }
```

The same service is available as **gRPC-Web** for browsers at `/syncloom.sync.v1.Sync/Subscribe`. Heartbeat messages (cursor `0`) are sent every 20 seconds, and the stream ends with an error status if the token is revoked.
