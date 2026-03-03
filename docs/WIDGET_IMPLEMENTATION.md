# iOS Home Screen Widget — Implementation Guide

> **Status:** Not yet implemented (requires native Swift code)
> **Target:** Small (2×2) iOS home screen widget
> **Expo SDK:** 54 — native widget support (`expo-widgets`) requires SDK 55+

---

## What the Widget Shows

- **Flame emoji + streak count** (e.g. "🔥 14")
- **Last log timestamp** (e.g. "Last logged: 2h ago")
- **Deuce Diary branding** in cream (#F5EFE0) / espresso (#1A0F00) colors
- Milestone badge when applicable (💎 ≥30d, 🥇 ≥14d, 🥈 ≥7d, 🥉 ≥3d)

---

## Recommended Approach: `@bacons/apple-targets`

**Why this library:**
- Maintained by Evan Bacon (Expo core team member)
- Works with Expo SDK 53+ via Continuous Native Generation (CNG)
- No eject to bare workflow required
- Endorsed in official Expo blog post
- Integrates with EAS Build pipeline

**Repository:** https://github.com/EvanBacon/expo-apple-targets

### Alternative: `react-native-widget-extension`

- Community config plugin (v0.2.0)
- Also works without ejecting, but less actively maintained
- Same Swift requirement for widget UI

---

## Step-by-Step Implementation

### 1. Install Dependencies

```bash
npx expo install @bacons/apple-targets
```

### 2. Configure `app.json`

Add the plugin and App Group entitlement:

```json
{
  "expo": {
    "plugins": [
      ["@bacons/apple-targets", {
        "type": "widget",
        "name": "DeuceDiaryWidget",
        "bundleIdentifier": "com.deucediary.mobile.widget",
        "deploymentTarget": "16.0",
        "entitlements": {
          "com.apple.security.application-groups": [
            "group.com.deucediary.mobile"
          ]
        }
      }]
    ],
    "ios": {
      "entitlements": {
        "com.apple.security.application-groups": [
          "group.com.deucediary.mobile"
        ]
      }
    }
  }
}
```

### 3. Create Widget Target Directory

```bash
npx create-target widget
```

This scaffolds a `targets/widget/` folder with Swift files.

### 4. Write the SwiftUI Widget

Replace `targets/widget/Widget.swift` with:

```swift
import WidgetKit
import SwiftUI

struct StreakEntry: TimelineEntry {
    let date: Date
    let currentStreak: Int
    let lastLogTime: String
    let milestoneBadge: String
}

struct Provider: TimelineProvider {
    let appGroupId = "group.com.deucediary.mobile"

    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(date: Date(), currentStreak: 7, lastLogTime: "2h ago", milestoneBadge: "🥈")
    }

    func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
        completion(readEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
        let entry = readEntry()
        // Refresh every 30 minutes
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())!
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func readEntry() -> StreakEntry {
        let defaults = UserDefaults(suiteName: appGroupId)
        let streak = defaults?.integer(forKey: "currentStreak") ?? 0
        let lastLog = defaults?.string(forKey: "lastLogTime") ?? "No logs yet"
        let badge = defaults?.string(forKey: "milestoneBadge") ?? ""
        return StreakEntry(date: Date(), currentStreak: streak, lastLogTime: lastLog, milestoneBadge: badge)
    }
}

struct DeuceDiaryWidgetEntryView: View {
    var entry: StreakEntry

    var body: some View {
        VStack(spacing: 6) {
            // Streak display
            HStack(spacing: 4) {
                Text("🔥")
                    .font(.title)
                Text("\(entry.currentStreak)")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(Color(hex: "1A0F00"))
                if !entry.milestoneBadge.isEmpty {
                    Text(entry.milestoneBadge)
                        .font(.title3)
                }
            }

            Text("\(entry.currentStreak)-day streak")
                .font(.caption)
                .foregroundColor(Color(hex: "636366"))

            Spacer().frame(height: 2)

            // Last log
            Text(entry.lastLogTime)
                .font(.caption2)
                .foregroundColor(Color(hex: "8E8E93"))

            // Branding
            Text("Deuce Diary")
                .font(.system(size: 10, weight: .semibold))
                .foregroundColor(Color(hex: "C8A951"))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(12)
        .background(Color(hex: "F5EFE0"))
    }
}

@main
struct DeuceDiaryWidget: Widget {
    let kind = "DeuceDiaryWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            DeuceDiaryWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Streak Tracker")
        .description("See your current deuce streak at a glance.")
        .supportedFamilies([.systemSmall])
    }
}

// Hex color helper
extension Color {
    init(hex: String) {
        let scanner = Scanner(string: hex)
        var rgb: UInt64 = 0
        scanner.scanHexInt64(&rgb)
        self.init(
            red: Double((rgb >> 16) & 0xFF) / 255.0,
            green: Double((rgb >> 8) & 0xFF) / 255.0,
            blue: Double(rgb & 0xFF) / 255.0
        )
    }
}
```

### 5. Bridge Data from React Native to Widget

Create a local Expo module to write streak data to the shared App Group:

```bash
npx create-expo-module@latest --local streak-bridge
```

In `modules/streak-bridge/ios/StreakBridge.swift`:

```swift
import ExpoModulesCore
import WidgetKit

public class StreakBridgeModule: Module {
    let appGroupId = "group.com.deucediary.mobile"

    public func definition() -> ModuleDefinition {
        Name("StreakBridge")

        Function("updateWidgetData") { (streak: Int, lastLogTime: String, badge: String) in
            let defaults = UserDefaults(suiteName: self.appGroupId)
            defaults?.set(streak, forKey: "currentStreak")
            defaults?.set(lastLogTime, forKey: "lastLogTime")
            defaults?.set(badge, forKey: "milestoneBadge")
            defaults?.synchronize()

            if #available(iOS 14.0, *) {
                WidgetCenter.shared.reloadAllTimelines()
            }
        }
    }
}
```

In the React Native app, call the bridge after each deuce log and streak fetch:

```typescript
import { NativeModulesProxy } from 'expo-modules-core';

const StreakBridge = NativeModulesProxy.StreakBridge;

export function updateWidgetStreak(currentStreak: number, lastLogTime: string) {
  const badge = currentStreak >= 30 ? '💎' : currentStreak >= 14 ? '🥇' : currentStreak >= 7 ? '🥈' : currentStreak >= 3 ? '🥉' : '';
  StreakBridge?.updateWidgetData(currentStreak, lastLogTime, badge);
}
```

### 6. Prebuild and Test

```bash
npx expo prebuild --clean
npx expo run:ios
```

The widget will appear in the iOS widget gallery under "Deuce Diary".

---

## What Expo Bare Workflow Migration Would Involve

If using `@bacons/apple-targets` or `react-native-widget-extension`, **no migration to bare workflow is needed**. Both use CNG (Continuous Native Generation) via config plugins. The `/ios` directory is generated on demand via `npx expo prebuild` and does not need to be committed.

Key points:
- **Expo Go** does not support widgets — use `npx expo run:ios` or EAS Build dev client
- **EAS Build** handles widget targets automatically when config plugins are set up
- The `app.json` remains the source of truth for native configuration
- Running `npx expo prebuild --clean` regenerates the Xcode project with widget target included

---

## Estimated Effort

| Task | Estimate |
|---|---|
| Install & configure `@bacons/apple-targets` | 1 hour |
| Write SwiftUI widget layout | 2-3 hours |
| Create local Expo module for data bridge | 2-3 hours |
| Integrate bridge calls into existing streak queries | 1 hour |
| Testing on device (widgets don't work in simulator well) | 2-3 hours |
| EAS Build configuration & validation | 1-2 hours |
| **Total** | **~1-2 days** |

---

## Future: `expo-widgets` (SDK 55+)

When the project upgrades to Expo SDK 55+, the first-party `expo-widgets` package offers a simpler path:
- Write widget UI with React components (no Swift required)
- Uses `@expo/ui` SwiftUI-backed components
- Currently in alpha — monitor for stable release
- Would replace both the Swift widget code and the native bridge module

---

## References

- [Expo blog: iOS widgets in Expo apps](https://expo.dev/blog/how-to-implement-ios-widgets-in-expo-apps)
- [@bacons/apple-targets](https://github.com/EvanBacon/expo-apple-targets)
- [react-native-widget-extension](https://github.com/bndkt/react-native-widget-extension)
- [expo-widgets docs (SDK 55)](https://docs.expo.dev/versions/v55.0.0/sdk/widgets/)
- [Apple WidgetKit documentation](https://developer.apple.com/documentation/widgetkit)
