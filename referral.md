# Referrer URL — How it works

## Overview

The `buildReferrer` function (in `src/utils/deeplink.ts`) generates a referrer URL that is passed to the Google Play Store when a user is redirected to install the native Android app. After installation, the Play Store delivers this referrer string to the app on first launch, allowing it to auto-authenticate the user or navigate to specific content.

## Function signature

```typescript
buildReferrer(data: ReferrerData): string
```

### Input

```typescript
interface ReferrerData {
  authToken?: string;  // The user's session token (from login or subscription)
  contentId?: string;  // A specific content/movie ID (optional)
}
```

### Output

A full URL string pointing back to the webapp origin, used as the Play Store `referrer` parameter.

## URL structure

The generated URL follows this pattern:

```
https://<webapp-origin>/<path>?utm_source=webapp[&authToken=<token>][&contentId=<id>]
```

- **Path** is `/detail` if a `contentId` is provided, otherwise `/app`
- **utm_source** is always set to `webapp` (identifies traffic source)
- **authToken** is included when the user is authenticated
- **contentId** is included when the user was viewing specific content

## Examples

### After subscription (ThankYouPage)

User subscribes and clicks "Open app":

```
https://playvod.com/app?utm_source=webapp&authToken=abc123
```

### From a content detail page

User views a movie and clicks to open in app:

```
https://playvod.com/detail?utm_source=webapp&authToken=abc123&contentId=456
```

### From the store footer (no auth)

User is not logged in and clicks the Play Store badge:

```
https://playvod.com/app?utm_source=webapp
```

## How it reaches the native app

1. `buildReferrer` generates the URL
2. `getStoreUrl` appends it to the Play Store URL as `&referrer=<encoded-url>`
3. Final Play Store link becomes:
   ```
   https://play.google.com/store/apps/details?id=com.virgoplay.playvod.af&referrer=https%3A%2F%2Fplayvod.com%2Fapp%3Futm_source%3Dwebapp%26authToken%3Dabc123
   ```
4. After install, the Play Store delivers the decoded referrer to the app via the Install Referrer API
5. The native app parses it to extract `authToken` and/or `contentId`

## Where it is called

| Location | Context |
|----------|---------|
| `ThankYouPage.tsx` | After subscription, user taps "Open app" |
| `ContentDetailPage.tsx` | User taps "Open in app" on a movie/series |
| `AppBanner.tsx` | User taps the app install banner |
| `StoreFooter.tsx` | User taps the Play Store badge in the footer |

## iOS

The referrer mechanism is Android-only (Play Store Install Referrer API). On iOS, the equivalent is handled by Universal Links and the Apple Smart Banner (`apple-itunes-app` meta tag), which passes the app-argument URL directly to the app on open.
