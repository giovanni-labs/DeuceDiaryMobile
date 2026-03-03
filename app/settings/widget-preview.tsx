import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

function getMilestoneBadge(streak: number): string {
  if (streak >= 30) return "\uD83D\uDC8E";
  if (streak >= 14) return "\uD83E\uDD47";
  if (streak >= 7) return "\uD83E\uDD48";
  if (streak >= 3) return "\uD83E\uDD49";
  return "";
}

function WidgetMockup({ streak, lastLog }: { streak: number; lastLog: string }) {
  const badge = getMilestoneBadge(streak);
  const active = streak > 0;

  return (
    <View
      style={styles.widget}
      accessibilityLabel={`Widget preview showing ${streak}-day streak, last logged ${lastLog}`}
      accessibilityRole="image"
    >
      {active ? (
        <>
          <View style={styles.widgetStreakRow}>
            <Text style={styles.widgetFlame}>{"\uD83D\uDD25"}</Text>
            <Text style={styles.widgetStreakNumber}>{streak}</Text>
            {badge ? <Text style={styles.widgetBadge}>{badge}</Text> : null}
          </View>
          <Text style={styles.widgetStreakLabel}>{streak}-day streak</Text>
        </>
      ) : (
        <>
          <Text style={styles.widgetInactiveEmoji}>{"\uD83D\uDEBD"}</Text>
          <Text style={styles.widgetInactiveText}>No active streak</Text>
        </>
      )}

      <Text style={styles.widgetLastLog}>{lastLog}</Text>

      <Text style={styles.widgetBrand}>Deuce Diary</Text>
    </View>
  );
}

export default function WidgetPreviewScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Home Screen Widget</Text>
      <Text style={styles.subtitle}>
        See your streak at a glance — right on your home screen.
      </Text>

      {/* Coming Soon badge */}
      <View style={styles.comingSoonBadge}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>

      {/* Widget previews */}
      <Text style={styles.sectionLabel}>Active Streak</Text>
      <View style={styles.widgetRow}>
        <WidgetMockup streak={14} lastLog="Last log: 2h ago" />
        <WidgetMockup streak={7} lastLog="Last log: 5h ago" />
      </View>

      <Text style={styles.sectionLabel}>Milestone Tiers</Text>
      <View style={styles.widgetRow}>
        <WidgetMockup streak={30} lastLog="Last log: 1h ago" />
        <WidgetMockup streak={3} lastLog="Last log: 12h ago" />
      </View>

      <Text style={styles.sectionLabel}>No Active Streak</Text>
      <View style={styles.widgetRow}>
        <WidgetMockup streak={0} lastLog="No logs yet" />
      </View>

      {/* Instructions */}
      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>How it will work</Text>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <Text style={styles.stepText}>
            Long-press your iOS home screen
          </Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <Text style={styles.stepText}>
            Tap the + button in the top corner
          </Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <Text style={styles.stepText}>
            Search for "Deuce Diary" and add the widget
          </Text>
        </View>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>4</Text>
          <Text style={styles.stepText}>
            Your streak updates automatically throughout the day
          </Text>
        </View>
      </View>

      <Text style={styles.footnote}>
        Widget requires iOS 16+ and will be available in a future update via the native widget system.
      </Text>
    </ScrollView>
  );
}

const WIDGET_SIZE = 155;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.espresso,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 16,
    lineHeight: 20,
  },

  // Coming soon badge
  comingSoonBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.gold,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 28,
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.white,
  },

  // Sections
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.secondaryText,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Widget row
  widgetRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 28,
  },

  // Widget mockup — simulates iOS small widget (2×2)
  widget: {
    width: WIDGET_SIZE,
    height: WIDGET_SIZE,
    backgroundColor: "#F5EFE0",
    borderRadius: 22,
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    // iOS widget shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  widgetStreakRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  widgetFlame: {
    fontSize: 22,
  },
  widgetStreakNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.espresso,
  },
  widgetBadge: {
    fontSize: 16,
  },
  widgetStreakLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: "600",
    marginTop: 1,
  },
  widgetInactiveEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  widgetInactiveText: {
    fontSize: 11,
    color: Colors.secondaryText,
    fontWeight: "600",
  },
  widgetLastLog: {
    fontSize: 9,
    color: Colors.gray,
    marginTop: 6,
  },
  widgetBrand: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.gold,
    marginTop: 4,
  },

  // Instruction card
  instructionCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.espresso,
    marginBottom: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.green,
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    overflow: "hidden",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: Colors.espresso,
    lineHeight: 20,
  },

  // Footnote
  footnote: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 18,
  },
});
