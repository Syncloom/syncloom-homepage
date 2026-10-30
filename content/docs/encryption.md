---
title: "Encryption"
subtitle: "The key hierarchy, the vault and the guarantees."
group: "Concepts"
weight: 20
---
## Your vault

When you create an account your device generates three secrets:

- a random **master key**,
- an **X25519 key pair** for receiving shared items, and
- a random **recovery key** that is shown to you exactly once.

Your password is stretched with **Argon2id** (64 MiB, 3 passes, 1 lane, random salt) into 64 bytes. The first 32 bytes become your *login secret* and are the only thing sent to the server (which stores a hash of it). The other 32 bytes are a key-encryption key that never leaves your device. It wraps the master key. The recovery key wraps a second copy of the master key.

The server therefore stores, per user: the salt and cost parameters, the master key wrapped twice, the public key, and the private key wrapped under the master key. All of it is ciphertext except the public key.

{{< callout type="warning" title="No recovery without the password or the recovery key" >}}
There is no reset flow that preserves data. If you lose both, the vault cannot be opened. Administrators can reset your *two-step verification*, but not your vault.
{{< /callout >}}

## Key hierarchy

Every file, folder and key/value namespace is a **node** with its own random 256-bit key.

```text
master key
 ├─ wraps → key of /Documents
 │           ├─ wraps → key of /Documents/report.docx
 │           └─ wraps → key of /Documents/Taxes
 └─ wraps → key of /Photos
```

A node's key is stored wrapped under its parent's key (root nodes under the master key). The node key encrypts the node's **name**, **metadata** (modification time, executable bit) and **content chunks**. Moving a node re-wraps its key under the new parent. Nothing else has to be re-encrypted.

All ciphertexts use **XChaCha20-Poly1305** with a fresh random 192-bit nonce. Associated data binds each ciphertext to its role and node id, so a name cannot be swapped with a manifest or moved to another node.

## Chunks

Files are split with **FastCDC** (64 KiB minimum, 256 KiB average, 1 MiB maximum), so inserting bytes near the start of a file only changes nearby chunks. Each chunk is encrypted and stored under the **BLAKE3 hash of its ciphertext**. The server verifies uploads against that hash and de-duplicates identical ciphertexts.

The list of chunks, the file size and a BLAKE3 hash of the plaintext live in a *manifest* that is itself encrypted. Clients verify the plaintext hash after every download.

## Sharing

Sharing with a user seals the node's key to the recipient's X25519 public key (an ephemeral key exchange followed by HKDF-SHA256 and the AEAD). The server stores the sealed key. Everything below the shared node is reachable through the key chain, so one sealed key shares a whole folder.

A **public link** generates a random link key and stores the node key encrypted with it on the server. The link key appears only in the URL fragment (`#k=…`), which browsers never send to servers.

{{< callout type="note" title="About revocation" >}}
Removing a share or a link stops the server from serving the data. A recipient who already downloaded and decrypted files keeps those copies, and keys they have already learned stay valid for chunks they could previously fetch. Rotate the contents (copy into a new folder) if you need cryptographic revocation.
{{< /callout >}}

## What the server can see

| Visible to the server | Not visible |
|---|---|
| Username, role, quota | File and folder **names** |
| Number and size of chunks, timestamps | File **contents** and metadata |
| Folder structure (which node is under which) | Key/value **values** |
| Share relationships and link settings | Passwords, vault keys, recovery keys |

Key/value *keys* (not values) are visible to the server so that prefix listing works.
