# Deeplink Integration Prompt

Use this prompt in another Bolt project to integrate deep linking with Play Store referral support and iOS Smart App Banner.

---

```
I need to integrate deep linking into my project with full Play Store referral support (Android) and iOS Smart App Banner support. Before implementing anything, analyze my project and answer these questions:

1. Is this an Expo / React Native project?
2. Does it build for Android, iOS, or both?
3. What router/navigation library is it using?

Then ask me the following questions ONE BY ONE before writing any code:

---

**Question 1 — Which deeplinks do you want?**
Present this list and let me pick which ones I need:
- /app — General app open (with optional authToken for auto-login)
- /detail — Open a specific content/item screen
- /reset-password — Open reset password flow
- /pair — Device pairing flow

Only implement the ones I select.

---

**Question 2 — Detail screen mapping (only if /detail was selected):**
Ask me:
- Which screen/page in my app should the detail deeplink open? (e.g., MovieDetailScreen, ProductScreen, ItemDetail)
- What field/parameter should be used as the contentId? (e.g., movieId, productId, itemId — this is the identifier passed in the deeplink URL)
- What is the route path to that screen in my navigation? (e.g., /movies/:id, /products/:id)

---

**Question 3 — Domain and scheme configuration:**
Ask me:
- What is the domain for Universal Links / App Links? (e.g., myapp.com)
- Do I also want a custom URL scheme fallback? If yes, what scheme? (e.g., myapp://)

---

**Question 4 — Android configuration:**
Ask me:
- What is the Android package name? (e.g., com.company.myapp)
- What is the SHA-256 certificate fingerprint for the signing key? (needed for assetlinks.json verification)

---

**Question 5 — iOS configuration:**
Ask me:
- What is the Apple Team ID?
- What is the Bundle ID? (e.g., com.company.myapp)
- What is the App Store ID? (numeric ID, needed for the Smart App Banner meta tag)

---

Once I have answered all questions, implement the following:

## A. Core Utility File — `deeplink.ts`

Create a utility file with these functions (only the ones relevant to my selected deeplinks):

### Platform detection
- `detectPlatform()` — returns "ios" | "android" | "desktop" based on user agent

### Deep link path builders
- `buildDeepLinkPath(contentId?, authToken?)` — builds the URL path with query params. If contentId is present, returns `/detail?id=<contentId>&authToken=<token>`. Otherwise returns `/app?authToken=<token>`.
- `buildResetPasswordPath(username)` — returns `/reset-password?username=<username>` (only if selected)
- `buildPairPath(code)` — returns `/pair?code=<code>` (only if selected)

### App Link URL
- `buildAppLinkUrl(path)` — prepends the configured domain to make a full https:// URL

### Play Store Referrer (critical — Android)
- `buildReferrer({ authToken?, contentId? })` — builds a referrer URL that gets passed to the Play Store. Structure: `https://<domain>/<path>?utm_source=webapp&authToken=<token>&contentId=<id>`. Uses `/detail` path if contentId is present, otherwise `/app`. This URL is delivered to the native app after install via the Play Store Install Referrer API.
- `getStoreUrl(platform, referrer?)` — returns the App Store URL for iOS (plain), or for Android appends `&referrer=<url-encoded-referrer>` to the Play Store URL. The referrer MUST always be included on Android when authToken or contentId is available.

### Open with fallback
- `openAppWithFallback(platform, appPath, referrer?)` — tries to open the app via App Link (creates an invisible anchor and clicks it). Records the attempt. After 3 seconds, if the page is still visible (app not installed), redirects to the store URL WITH the referrer attached.
- `markAppLinkAttempt(platform, referrer)` — stores attempt in sessionStorage with timestamp
- `checkAppLinkAttempt()` — checks if a recent attempt exists (within 3s TTL), returns platform + referrer, removes the entry

### iOS Smart App Banner
- `updateSmartBanner(currentPath, authToken?)` — updates the `<meta name="apple-itunes-app">` tag with `app-id=<APP_STORE_ID>, app-argument=<full-url>`. The app-argument should be the full URL including path and authToken so the native iOS app receives it on open. This must be called on every route change and whenever authToken changes.

### Auth token retrieval
- `getStoredAuthToken()` — reads the auth token from localStorage/session storage (adapt to whatever auth system the project uses)

---

## B. Play Store Referral Flow (Android) — for ALL deeplinks

Every place in the app that links to the Play Store or attempts to open the native app MUST include the referrer. Implement this pattern everywhere:

1. **App Banner** (shown on Android): When user taps "Open", build the referrer with current authToken + contentId (if on a detail page), then attempt app link with fallback to Play Store + referrer.

2. **Store Footer / Store badges**: The Google Play badge link must always include `&referrer=<encoded-referrer-url>` with the current authToken and contentId (if available).

3. **After authentication/subscription** (e.g., Thank You page): Build referrer with authToken, attempt app link, fall back to Play Store + referrer.

4. **Detail page** (if selected): Build referrer with authToken + contentId, attempt app link, fall back to Play Store + referrer.

5. **Reset password / Pair flows** (if selected): Same pattern — build appropriate referrer, open app link, fall back to store.

The referrer ensures that even if the user has to install the app first, the native app receives the authToken and contentId on first launch and can auto-login or navigate to the right content.

---

## C. iOS Smart App Banner — for ALL deeplinks

Add a `<meta name="apple-itunes-app" content="app-id=<ID>, app-argument=<url>">` tag in the HTML head.

Then implement dynamic updates:

1. **On every route change**: Call `updateSmartBanner(currentPath, authToken)` so the banner always reflects the current page and auth state.

2. **On detail pages**: The app-argument should be `https://<domain>/content/<contentId>?authToken=<token>` so tapping the banner opens the correct content in the native app.

3. **On auth pages** (thank you, reset password): Include the authToken in the app-argument URL.

4. **Layout/root component**: Set up a useEffect that calls updateSmartBanner on every pathname change, reading the current stored authToken.

The iOS Smart Banner is the native Safari prompt that says "Open in <App Name>" — it appears automatically when the meta tag is present and the app is not installed (shows "View" to go to App Store) or is installed (shows "Open").

---

## D. Native App Configuration

### For Expo projects:

1. Update `app.json` / `app.config.js`:
   - `expo.android.intentFilters`: Add intent filter with `autoVerify: true`, scheme `https`, host `<domain>`, and pathPrefix for each selected deeplink path
   - `expo.ios.associatedDomains`: Add `applinks:<domain>`

2. Configure linking in navigation to map deeplink paths to screens (use the detail screen name and contentId field I specified)

### For bare React Native projects:

1. **AndroidManifest.xml** — Add intent filter to main activity:
   ```xml
   <intent-filter android:autoVerify="true">
     <action android:name="android.intent.action.VIEW" />
     <category android:name="android.intent.category.DEFAULT" />
     <category android:name="android.intent.category.BROWSABLE" />
     <data android:scheme="https" android:host="<domain>" android:pathPrefix="/app" />
     <data android:scheme="https" android:host="<domain>" android:pathPrefix="/detail" />
     <!-- Add one data element per selected deeplink path -->
   </intent-filter>
   ```

2. **iOS Entitlements file** (e.g., `Runner.entitlements` or via Xcode):
   Add Associated Domains capability with `applinks:<domain>`

3. **apple-app-site-association** (to be hosted at `https://<domain>/.well-known/apple-app-site-association`):
   ```json
   {
     "applinks": {
       "apps": [],
       "details": [{
         "appID": "<TeamID>.<BundleID>",
         "paths": ["/app*", "/detail*", "/reset-password*", "/pair*"]
       }]
     }
   }
   ```
   Only include paths for selected deeplinks.

4. **assetlinks.json** (to be hosted at `https://<domain>/.well-known/assetlinks.json`):
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "<package>",
       "sha256_cert_fingerprints": ["<SHA-256>"]
     }
   }]
   ```

---

## E. Install Referrer Handling (Native Android side)

Remind me that the native Android app needs to:
1. Add the Play Install Referrer library dependency
2. On first launch, read the install referrer using the Install Referrer API
3. Parse the referrer URL to extract `authToken` and `contentId` query parameters
4. If authToken is present, auto-authenticate the user
5. If contentId is present, navigate to the detail screen

---

## IMPORTANT RULES:
- Do NOT implement deeplinks I did not select
- Do NOT hardcode any values — use exclusively the answers I provide
- If my project does not build for one platform, skip that platform entirely
- If I am using Expo, prefer Expo-native configuration over bare native files
- EVERY Android store link must include the referrer when auth or content context is available
- The iOS Smart Banner must be dynamically updated on every route change
- For the detail deeplink, use the exact screen name and contentId parameter name I specified
- Explain each file you create/modify and why
```
