import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
import { useRevenueCat } from "../../hooks/useRevenueCat";

const features = [
  {
    emoji: "\uD83D\uDD25",
    title: "Streak Insurance",
    description: "Miss a day? We've got you.",
  },
  {
    emoji: "\uD83C\uDFC6",
    title: "Gold Badge",
    description: "Show the squad who's boss.",
  },
  {
    emoji: "\uD83C\uDFA8",
    title: "Custom Themes",
    description: "Make it yours.",
  },
  {
    emoji: "\uD83D\uDCCA",
    title: "Throne Analytics",
    description: "Know your numbers.",
  },
];

export default function PremiumScreen() {
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [upgrading, setUpgrading] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const router = useRouter();
  const { isPremium, purchaseMonthly, purchaseAnnual } = useRevenueCat();

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      const result =
        plan === "monthly" ? await purchaseMonthly() : await purchaseAnnual();
      if (result.success) {
        setUpgraded(true);
      }
    } catch (err: any) {
      Alert.alert("Upgrade failed", err.message || "Something went wrong.");
    } finally {
      setUpgrading(false);
    }
  }

  if (upgraded || isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successEmoji}>{"\uD83D\uDC51\uD83C\uDF89"}</Text>
          <Text style={styles.successTitle}>Welcome to the Throne Room</Text>
          <Text style={styles.successSubtitle}>
            You're Porcelain Premium now. Long live the king.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>{"\uD83D\uDC51"}</Text>
        <Text style={styles.heroTitle}>Go Porcelain Premium</Text>
        <Text style={styles.heroSubtitle}>
          Elevate your throne experience.
        </Text>
      </View>

      {/* Feature Cards */}
      {features.map((feature) => (
        <View key={feature.title} style={styles.featureCard}>
          <Text style={styles.featureEmoji}>{feature.emoji}</Text>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>
              {feature.description}
            </Text>
          </View>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumBadgeText}>Premium</Text>
          </View>
        </View>
      ))}

      {/* Free Tier Reminder */}
      <View style={styles.freeSection}>
        <Text style={styles.freeSectionTitle}>Free forever</Text>
        <View style={styles.freeChips}>
          {[
            "\uD83D\uDCA9 Log Deuces",
            "\uD83D\uDC65 Groups",
            "\uD83D\uDD25 Streaks",
            "\uD83D\uDC4F Reactions",
          ].map((label) => (
            <View key={label} style={styles.freeChip}>
              <Text style={styles.freeChipText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pricing Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            plan === "monthly" && styles.toggleButtonActive,
          ]}
          onPress={() => setPlan("monthly")}
        >
          <Text
            style={[
              styles.toggleText,
              plan === "monthly" && styles.toggleTextActive,
            ]}
          >
            Monthly — $3.99
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            plan === "annual" && styles.toggleButtonActive,
          ]}
          onPress={() => setPlan("annual")}
        >
          <Text
            style={[
              styles.toggleText,
              plan === "annual" && styles.toggleTextActive,
            ]}
          >
            Annual — $29.99
          </Text>
        </TouchableOpacity>
      </View>

      {plan === "annual" && (
        <Text style={styles.savings}>Save 37% with annual billing</Text>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={[styles.ctaButton, upgrading && styles.ctaButtonDisabled]}
        onPress={handleUpgrade}
        disabled={upgrading}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>
          {upgrading ? "Upgrading..." : "Upgrade to Premium"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Dev mode — no real payment will be charged.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  // Hero
  hero: {
    alignItems: "center",
    marginBottom: 28,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.espresso,
    fontFamily: "Georgia",
    marginBottom: 6,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: "center",
  },
  // Feature Cards
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: 14,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.espresso,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  premiumBadge: {
    backgroundColor: "rgba(200, 169, 81, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  // Free Section
  freeSection: {
    backgroundColor: Colors.lightGray + "66",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  freeSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.espresso,
    marginBottom: 10,
  },
  freeChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  freeChip: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  freeChipText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  // Toggle
  toggleRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  toggleButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
  },
  toggleButtonActive: {
    backgroundColor: Colors.espresso,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.secondaryText,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  // Savings
  savings: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
    color: Colors.green,
    marginBottom: 20,
  },
  // CTA
  ctaButton: {
    backgroundColor: Colors.green,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonDisabled: {
    opacity: 0.6,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.white,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 16,
  },
  // Success
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  successEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.espresso,
    fontFamily: "Georgia",
    marginBottom: 10,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: Colors.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
});
