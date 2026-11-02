---
title: "Administration"
subtitle: "Users, quotas, retention, backups and upgrades."
group: "Operating"
weight: 70
---
## People

The **Admin** page lists accounts with storage use and second-factor state. From there you can invite people, set per-user **quotas**, promote or demote administrators, disable or delete accounts, pre-create SSO users and **reset two-step verification**. The last active administrator cannot be demoted, disabled or deleted.

## Quotas

A quota counts every stored version of a user's files (including files that others uploaded into their shared folders). When a write would exceed it, the server answers `413`. Set a server-wide default under *Retention & quota*.

## Retention

| Setting | Default |
|---|---|
| Trash | 30 days |
| Old versions | 90 days |
| Newest versions always kept | 5 |

A background job runs hourly (`MAINTENANCE_INTERVAL_SECS`). It purges expired trash, prunes versions and deletes encrypted chunks that no version references any more (after a one-day grace period for uploads in flight).

## Backups

Back up two things together:

```bash
# database
docker compose exec -T db pg_dump -U syncloom syncloom > syncloom-$(date +%F).sql
# encrypted file chunks (the ./files folder next to docker-compose.yml)
tar czf blobs-$(date +%F).tgz -C files .
```

With `BLOB_BACKEND=s3`, enable versioning or replication on the bucket instead. Backups contain only ciphertext, so they are safe to store off-site. They are useless without users' passwords or recovery keys.

## Upgrading

```bash
git pull && docker compose pull && docker compose up -d
```

Migrations run at startup. Roll back by restoring the database backup and starting the previous image tag.

## Health and logs

`GET /health` returns `ok`. The container reports its own health status. Logs go to stdout; tune them with `RUST_LOG` (default `info,sqlx=warn`).
