---
title: "Accounts and two-step sign-in"
subtitle: "Registration, invitations, second factors and single sign-on."
group: "Concepts"
weight: 30
---
## Registration

The **first account** on a fresh server becomes the administrator. After that, registration is by **invitation only**: an administrator creates a single-use code (valid for 7 days) in *Admin → Invite someone* and sends it to the person.

## Built-in sign-in needs a second factor

With built-in accounts, a password alone never gives access. After the password, you must prove possession of **one** enrolled second factor:

- an **authenticator app** (TOTP, 6 digits, SHA-1, 30 s) such as Aegis, 1Password or Google Authenticator,
- a **hardware security key** (WebAuthn / FIDO2, touch to confirm) such as a YubiKey, or
- a single-use **recovery code**.

You can enrol **as many factors as you like**. Keep two security keys on different keyrings and an authenticator app as the third. Any single one signs you in. The last remaining factor cannot be removed.

Codes cannot be replayed: a TOTP time step is accepted once per authenticator. Repeated failures lock an account's sign-in for 15 minutes.

### Recovery codes

Ten recovery codes are created together with your first factor. Each works once. You can generate a new set in *Settings*, which invalidates the old one.

### Lost every factor?

An administrator can **reset two-step verification** for your account. You are signed out everywhere and must enrol a new factor at your next sign-in. Your files are unaffected, because two-step verification protects access to the server and not the encryption keys.

## Single sign-on (OpenID Connect)

Set `OIDC_ISSUER`, `OIDC_CLIENT_ID` and `OIDC_CLIENT_SECRET` to let people sign in through your identity provider. Your provider is then responsible for multi-factor authentication.

SSO accounts have no password, so on first sign-in you choose a **vault passphrase**. It encrypts your files and is separate from your identity. Administrators either pre-create SSO users or enable `OIDC_AUTO_PROVISION=true`. Set `LOCAL_AUTH=false` to disable built-in passwords entirely.

## Devices

Every app and browser session has its own revocable token. See and sign out your devices under *Settings → Signed-in devices*. Changing your password signs out every other device.
