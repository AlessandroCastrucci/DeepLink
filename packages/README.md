# Vendored packages

## `app-banner/`

This directory is a **full copy** of the standalone `app-banner` SDK (sources + build config). The web app imports it as a normal dependency:

```json
"app-banner": "file:./packages/app-banner"
```

Remote environments (CI, cloud sandboxes) **do not** need access to `../../Multiplatform`; everything required lives under this repo.

### Updating the copy from the canonical repo

If you keep the SDK’s **source of truth** elsewhere (for example `../Multiplatform/app-banner` next to this repo), sync from repository root:

```bash
# example: sibling folder Multiplatform/app-banner (adjust if your layout differs)
rsync -a --delete \
  --exclude node_modules \
  --exclude dist \
  ../../Multiplatform/app-banner/ ./packages/app-banner/

cd packages/app-banner && npm install && npm run build && cd ../..
```

Then commit everything under `packages/app-banner/`, **including `dist/`**, so remotes work without relying on install scripts.
