# app-banner

Small **Android-oriented** “smart banner” for the web: one **script tag** and `data-*` attributes. Tapping **Open** uses an `intent://` URL with Play Store fallback.

## Build

```bash
npm install
npm run build
```

Ship **`dist/app-banner.umd.cjs`** (and optional source maps) to your CDN or static host.

## Embed

```html
<script
  src="/path/to/app-banner.umd.cjs"
  data-app-banner
  data-package="com.example.app"
  data-title="Example"
  async
></script>
```

| Attribute | Required | Description |
|-----------|----------|---------------|
| `data-app-banner` | yes | Marks this loader script (value can be empty). |
| `data-package` | yes | Play Store application id. |
| `data-title` | no | Banner title (default `App`). |
| `data-description` | no | Subtitle copy. |
| `data-deep-link` | no | Defaults to the **current page URL** when the script runs. |
| `data-icon` | no | URL of a square icon. |
| `data-play-store-url` | no | Full override of the Play URL. If set, `data-play-referrer` is not appended. |
| `data-play-referrer` | no | Install `referrer` string appended as `&referrer=` on the default Play URL (e.g. UTM / attribution). |
| `data-open-fallback-enabled` | no | `true` / `false` (default `true`). If the page stays in the foreground, redirect to Play after the timeout. |
| `data-open-fallback-timeout-ms` | no | Delay in ms before that redirect (default `3000`). Set `0` to disable. |
| `data-dismiss-days` | no | Days to hide after dismiss (default `7`). |
| `data-show-android-only` | no | `true` / `false` (default `true`). |
| `data-open-button-text` | no | Default `Open`. |
| `data-theme` | no | `light` / `dark` / `auto` (default `auto`). |
| `data-storage-key` | no | Suffix for `localStorage` key; default is the package name. |

## Test locally

```bash
npm run demo
```

Open **http://localhost:4173/demo/** — the demo uses `data-show-android-only="false"` so the banner appears on desktop too. On a phone on the same Wi‑Fi, use `http://YOUR_LAN_IP:4173/demo/` to exercise the real Android intent flow.

### Open behavior

1. **Intent** — Tapping **Open** navigates to an `intent://` URL whose `S.browser_fallback_url` is the resolved Play Store URL (includes `referrer` when `data-play-referrer` is set).
2. **Secondary fallback** — If the document stays visible (no `visibilitychange` to hidden) for `data-open-fallback-timeout-ms`, the SDK navigates to that same Play URL. Disable with `data-open-fallback-enabled="false"` or timeout `0`.

### SPA / bundler (programmatic)

Import **`mountAppBanner`** and **`createBannerOptions`** to refresh the deep link when the route or auth context changes:

```ts
import { createBannerOptions, mountAppBanner } from "app-banner";

const cleanup = mountAppBanner(
  createBannerOptions({
    packageName: "com.example.app",
    deepLink: "https://example.com/detail?id=1",
    title: "Example",
    topInsetPx: 56,
  }),
);
```

Call **`cleanup()`** on unmount or before replacing options.

## License

MIT
