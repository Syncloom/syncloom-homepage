---
title: "Changelog"
subtitle: "What changed in each release."
group: "Reference"
weight: 120
---
## 0.1.0 (public preview)

*The first public release. Expect rough edges.*

- End-to-end encrypted file sync and key/value storage
- Web app, macOS and iOS apps (Finder integration on macOS), Linux GTK app and CLI, Android app and a Windows client
- Mandatory two-step sign-in with any number of authenticator apps and hardware security keys, plus recovery codes
- Automatic three-way merge for text files, conflict copies, and "edit beats delete"
- Rename and move detection, versions, trash and configurable retention
- Sharing with people and password-protected public links with the key in the URL fragment
- OpenID Connect sign-in
- Live updates through a streaming change feed (web, macOS, iOS)
- Docker Compose bundle with automatic HTTPS and optional S3 storage

### Known limits

- The Windows client has not been built or tested yet.
- The iOS Files extension and the Android app have not been tested on real devices.
- Security keys in the native apps work on macOS only so far. Other platforms use authenticator apps and recovery codes.
- Linux on-demand files (FUSE) and Windows Files On-Demand hydration are not implemented.
- The S3 storage backend has not been tested against a real S3 service.
- Revoking a share does not rotate keys yet.
