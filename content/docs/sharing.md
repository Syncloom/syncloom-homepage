---
title: "Sharing and public links"
subtitle: "Give people access without giving up your keys."
group: "Concepts"
weight: 50
---
## Sharing with people

Open **Share** on a file, folder or key/value namespace and enter a username. Choose **Can view** or **Can edit**. The folder key is encrypted on your device for that person and stored on the server. They see the item under *Shared with me*.

- Editors can add, change, rename, move and delete inside the shared folder. Storage they use is charged to the owner.
- Only the owner can share further or manage links.
- Recipients can leave a share; owners can revoke it at any time.

## Public links

A public link lets anyone with the URL read a file or folder, with no account. You can add:

- a **password**, checked by the server with rate limiting,
- an **expiry** date, and
- a **download limit**.

The link looks like `https://sync.example.com/s/Xk3…#k=Abc…`. Everything after `#` is the decryption key. It is **never sent to the server**, so keep the whole URL together. A link without it can be opened but cannot be decrypted.

{{< callout type="warning" >}}
Anyone who obtains the full URL (and the password, if set) can download the content until the link is deleted or expires. Treat it like a password.
{{< /callout >}}
