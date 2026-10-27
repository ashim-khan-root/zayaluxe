# Local infrastructure — one command, no manual DB setup (phases.md 1.3)

Three services, nothing else. Kubernetes and extra services can wait until they are
needed (architecture.md principle 3, ADR-010).

```bash
npm run infra:up      # start
npm run infra:logs    # tail
npm run infra:down    # stop (keeps volumes)
docker compose -f infra/docker-compose.yml down -v   # stop + wipe data
```

| Service | Port | Purpose |
|---|---|---|
| `postgres` | 5432 | Medusa primary database |
| `redis` | 6379 | Cache, event bus, workflow engine, locking |
| `meilisearch` | 7700 | Product index + Arabic search |

Meilisearch master key for local dev is `local-dev-master-key`. It is in
`infra/.env.example` and is **local only** — never reuse it on staging or production.

## Not included here

- **Media (R2):** use a real R2 bucket or local disk in dev; no S3 emulator by default
  (add MinIO only if local uploads become painful).
- **Production:** `docker-compose.prod.yml` + Caddy on a single EC2 host in Bahrain
  (`me-south-1`). See `docs/runbooks/deploy.md` when it exists.
