---
title: "Key/value store"
subtitle: "Small, encrypted values with compare-and-set and live updates."
group: "Concepts"
weight: 60
---
A **namespace** is like a folder for keys. It lives in your file tree, so it can be shared, trashed and counted against your quota like anything else.

- Keys are strings up to 512 bytes. Values are opaque bytes up to **256 KB**, encrypted with the namespace key.
- Every write increments a per-key **version**.
- Writes may be **conditional**: `if_version = N` only succeeds if the current version is N (`0` means "must not exist"). A stale write answers `409` with the current value.
- Without a condition the **last writer wins**.
- Changes appear in the change feed, so apps can react immediately.

## From the command line

```bash
NS=$(syncloom kv create settings)
syncloom kv put "$NS" theme dark
syncloom kv put "$NS" theme light --if-version 1     # ok
syncloom kv put "$NS" theme stale --if-version 1     # rejected: version moved on
syncloom kv list "$NS" th                            # prefix listing
```

## Over HTTP

Values are encrypted by the client before they are sent (see [encryption](/docs/encryption/)). The endpoints carry base64url ciphertext:

```http
PUT /api/v1/kv/{namespace}/e/{key}
{ "value": "<ciphertext>", "if_version": 1 }

GET /api/v1/kv/{namespace}/list?prefix=th
```
