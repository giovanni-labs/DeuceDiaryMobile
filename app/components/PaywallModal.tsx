import { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Colors } from "../../constants/colors";
import { useRevenueCat } from "../../hooks/useRevenueCat";
import {
  usePaywall,
  FEATURE_CONFIG,
  type PaywallFeature,
} from "../../hooks/usePaywall";

// ── Premium feature list shown in every paywall ─────────────────────────
const PREMIUM_FEATURES = [
  { emoji: "\uD83D\uDC65", label: "Unlimited Squads" },
  { emoji: "\uD83D\uDD25", label: "Streak Insurance" },
  { emoji: "\uD83C\uDFA8", label: "Custom Themes" },
  { emoji: "\uD83D\uDCCA", label: "Throne Analytics" },
  { emoji: "\uD83C\uDFAF", label: "Daily Challenges" },
  { emoji: "\uD83D\uDD75\uFE0F", label: "Spy Mode" },
];

export function PaywallModal() {
  const { activeFeature, dismissPaywall } = usePaywall();
  const { purchaseMonthly, purchaseAnnual } = useRevenueCat();
  const [purchasing, setPurchasing] = useState<"monthly" | "annual" | null>(
    null,
  );

  if (!activeFeature) return null;

  const config = FEATURE_CONFIG[activeFeature];

  async function handlePurchase(plan: "monthly" | "annual") {
    setPurchasing(plan);
    try {
      const result =
        plan === "monthly" ? await purchaseMonthly() : await purchaseAnnual();
      if (result.success) {
        dismissPaywall();
      }
    } catch (err: any) {
      Alert.alert("Purchase failed", err.message || "Something went wrong.");
    } finally {
      setPurchasing(null);
    }
  }

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={dismissPaywall}
    >
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={dismissPaywall}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>{"\u2715"}</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero */}
          <Text style={styles.heroEmoji}>{"\uD83D\uDC51"}</Text>
          <Text style={styles.brand}>Porcelain Premium</Text>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.description}</Text>

          {/* Feature list */}
          <View style={styles.featureList}>
            {PREMIUM_FEATURES.map((f) => (
              <View key={f.label} style={styles.featureRow}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureCheck}>{"\u2713"}</Text>
              </View>
            ))}
          </View>

          {/* CTA Buttons */}
          <TouchableOpacity
            style={styles.annualButton}
            onPress={() => handlePurchase("annual")}
            disabled={purchasing !== null}
            activeOpacity={0.85}
          >
            {purchasing === "annual" ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.annualButtonText}>
                  Annual — $19.99/yr
                </Text>
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>Save 44%</Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.monthlyButton}
            onPress={() => handlePurchase("monthly")}
            disabled={purchasing !== null}
            activeOpacity={0.85}
          >
            {purchasing === "monthly" ? (
              <ActivityIndicator color={Colors.espresso} />
            ) : (
              <Text style={styles.monthlyButtonText}>
                Monthly — $2.99/mo
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Cancel anytime. Recurring billing.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.secondaryText,
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  brand: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.gold,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.espresso,
    fontFamily: "Georgia",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  // Feature list
  featureList: {
    width: "100%",
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 14,
  },
  featureLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.espresso,
  },
  featureCheck: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.green,
  },
  // Annual CTA
  annualButton: {
    flexDirection: "row",
    backgroundColor: Colors.green,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  annualButtonText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },
  saveBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: Colors.white,
  },
  // Monthly CTA
  monthlyButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: Colors.warmSand,
    backgroundColor: Colors.white,
  },
  monthlyButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.espresso,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 16,
  },
});
