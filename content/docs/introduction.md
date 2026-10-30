---
title: "Introduction"
subtitle: "What Syncloom is, and how the pieces fit together."
group: "Getting started"
weight: 10
---
Syncloom is a self-hosted file sync and key/value store. It does what you expect from Dropbox or Nextcloud's files app, and only that: no calendar, no plugins, no groupware. In exchange it is small, fast, and **end-to-end encrypted**.

## The pieces

| Component | What it does |
|---|---|
| **Server** | A Rust service (REST and gRPC) backed by PostgreSQL and a blob store. It handles accounts, stores ciphertext and pushes change notifications. |
| **Web app** | A SvelteKit single-page app. It decrypts everything in your browser with WebAssembly. |
| **Core** | A shared Rust library with the crypto, chunking, merge logic and sync engine. Every client uses it, so they all agree bit for bit. |
| **Apps** | Native clients for macOS, iOS, Linux, Windows and Android, plus a command-line client. |

## A request, end to end

When you save a file in a folder on your laptop:

1. The sync engine notices the change and splits the file into content-defined chunks.
2. Each chunk is encrypted with the file's key and named by the hash of its ciphertext.
3. Only chunks the server does not already have are uploaded.
4. A new *version* referencing the chunk list is committed, but only if it is based on the current head version. Otherwise the server answers *conflict* and the client merges.
5. The server pushes a change event over a gRPC stream. Your phone and browser fetch what changed.

{{< callout type="tip" title="What is not here" >}}
Because the server never sees plaintext, it cannot search inside files, render previews or index content. Search and previews happen on your devices.
{{< /callout >}}

## Where to go next

- [Encryption](/docs/encryption/): keys, the vault and what the server can and cannot see
- [Accounts and two-step sign-in](/docs/accounts/)
- [Syncing and conflicts](/docs/sync/)
- [Sharing and public links](/docs/sharing/)
