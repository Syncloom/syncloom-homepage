---
title: "Command-line client"
subtitle: "Sync, share and script from a terminal or a headless server."
group: "Reference"
weight: 100
---
The `syncloom` command works on Linux and macOS. It stores your unlocked vault keys in the system keychain (Secret Service on Linux). If none is available, as on a headless server, it uses a file readable only by you.

```bash
syncloom register https://sync.example.com alice --invite CODE   # first run, or login
syncloom login https://sync.example.com alice
syncloom sync                      # one reconciliation
syncloom daemon                    # keep ~/Syncloom in sync, reacting to server pushes
syncloom status
```

## Everyday commands

| Command | What it does |
|---|---|
| `ls [path]` | List a remote folder |
| `share <path> <user> [--read-only]` | Share with another user |
| `link <path> [--password P] [--days N] [--max-downloads N]` | Create a public link |
| `mfa list \| add-totp \| rename \| remove \| recovery-codes` | Manage second factors |
| `devices` | Show signed-in devices |
| `kv create \| put \| get \| list \| delete` | Key/value store |
| `totp <secret>` | Print the current code for an authenticator secret |
| `logout` | Sign out and forget the keys on this machine |

## Environment

| Variable | Use |
|---|---|
| `SYNCLOOM_CONFIG_DIR` | Where config and state live (default `~/.config/syncloom`) |
| `SYNCLOOM_PASSWORD`, `SYNCLOOM_TOTP` | Supply credentials non-interactively (CI, scripts) |
| `SYNCLOOM_NO_KEYRING` | Always use the 0600 file instead of the system keychain |

{{< callout type="note" >}}
The command-line client supports authenticator apps and recovery codes. Hardware security keys are available in the web and native apps.
{{< /callout >}}
