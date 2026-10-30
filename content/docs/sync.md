---
title: "Syncing and conflicts"
subtitle: "How the sync engine reconciles changes, and what happens when edits collide."
group: "Concepts"
weight: 40
---
## How sync works

The server keeps an ordered **change feed**: every change to a node you can access gets a cursor number. Apps hold a gRPC stream open and are woken up the moment something changes. If the stream drops they fall back to polling and resume from their last cursor.

The desktop sync engine keeps three views of every file:

- the **base**: what disk and server agreed on at the last sync,
- the **local** file system, and
- the **remote** tree, as mirrored from the change feed.

Comparing these three tells it, per file, whether to upload, download, merge or delete. Files are identified by a stable server id, never by path.

## Renames and moves

Renaming or moving a file or folder locally is applied as a **rename or move** on the server (it recognises the inode). Nothing is re-uploaded and the file keeps its history, shares and links.

## When two devices edit the same file

| Situation | Result |
|---|---|
| Different parts of a text file edited | Automatic three-way **merge**, uploaded as a new version |
| The same lines edited, or a binary file | The server's version keeps the name. Yours is saved as `name (conflict – <device> – <date>).ext` and uploaded as a new file |
| One side edited, the other deleted | The **edit wins**: the file is restored |
| Both created the same name | Identical content is adopted, otherwise both are kept (one as a conflict copy) |
| Names that collide on macOS/Windows (`A.txt` vs `a.txt`, composed vs decomposed accents) | Every file keeps a unique, stable local name; nothing is lost |

Text files are detected by content (valid UTF-8, no NUL bytes, up to 5 MiB), not by extension. Merging happens on your device, because the server cannot read the files.

{{< callout type="tip" title="Safety net" >}}
Every upload is a version, so even a merge that went wrong can be undone from the version history.
{{< /callout >}}

## What is not synced

Symbolic links and special files are ignored. Names that cannot exist on every platform (reserved Windows names like `CON`, characters such as `: * ? " < > |`, trailing dots or spaces) are skipped and reported, so that a file created on Linux can never become un-syncable on Windows. Temporary files starting with `.syncloom-tmp-` are never uploaded.

## Versions, trash and retention

Deleted files go to the trash for 30 days. Old versions are pruned after 90 days, always keeping the newest five. Administrators can change both in *Admin → Retention*. Versions count towards your quota.
