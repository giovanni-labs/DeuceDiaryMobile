# App Store Submission Checklist

## Kyle's To-Do (requires Apple account + Expo account)

### 1. Expo Account
- [ ] Create Expo account at expo.dev (or log in): `eas login`
- [ ] Link the project to EAS: `eas init` — paste the generated `projectId` into `app.json > extra.eas.projectId`

### 2. Apple Developer Account ($99/yr)
- [ ] Enroll at developer.apple.com if not already done
- [ ] Note your **Apple Team ID** (Membership page) → paste into `eas.json > submit.production.ios.appleTeamId`

### 3. App Store Connect
- [ ] Go to appstoreconnect.apple.com → My Apps → (+) New App
  - Platform: iOS
  - Name: **Deuce Diary**
  - Bundle ID: `com.deucediary.mobile`
  - SKU: `com.deucediary.mobile`
- [ ] Note the **App ID** (10-digit number) → paste into `eas.json > submit.production.ios.ascAppId`

### 4. In-App Purchases (RevenueCat)
- [ ] Create RevenueCat project at app.revenuecat.com
- [ ] Add iOS app with bundle ID `com.deucediary.mobile`
- [ ] Copy the **Public SDK Key** → add to `.env` as `EXPO_PUBLIC_REVENUECAT_KEY=<key>`
- [ ] Create products in App Store Connect:
  - Monthly: `com.deucediary.premium.monthly` — $3.99/mo
  - Annual: `com.deucediary.premium.annual` — $29.99/yr
- [ ] Add products to RevenueCat entitlement `premium`

### 5. Clerk Auth (if using Clerk)
- [ ] Create Clerk app at clerk.com
- [ ] Add `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<key>` to `.env`
- [ ] Add `CLERK_SECRET_KEY=<key>` to Railway environment variables

### 6. Build & Submit
```bash
# First production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production

# Or do both in one command
eas build --platform ios --profile production --auto-submit
```

### 7. App Store Connect — After Submission
- [ ] Upload screenshots (6.7" iPhone required, 6.5" and 5.5" recommended)
- [ ] Set age rating (4+)
- [ ] Privacy policy URL (create a simple one at deucediary.app/privacy or use a generator)
- [ ] App category: Health & Fitness (primary), Social Networking (secondary)
- [ ] Paste description from `store/description.txt`
- [ ] Paste keywords from `store/keywords.txt` (100 char max)
- [ ] Paste release notes from `store/release-notes-1.0.0.txt`

### 8. Review Notes (for Apple reviewer)
```
Demo account for review:
Username: reviewer
The app logs daily bathroom habits for streak tracking purposes.
No account creation required — just enter any username to get started.
```

---

## What's Already Done ✅
- `app.json` — bundle ID, iOS permissions, associated domains, notifications, SKAdNetwork
- `eas.json` — dev/preview/production build profiles with correct API URLs
- EAS CLI installed (v18.0.3)
- RevenueCat SDK integrated (`hooks/useRevenueCat.ts`)
- Push notifications configured
- Universal link handling for invites

## What Requires No Action
- Signing certificates — EAS manages these automatically (`credentialsSource: remote`)
- Provisioning profiles — EAS handles
- Build number incrementing — `autoIncrement: true` in production profile
