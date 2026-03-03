import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { useRevenueCat } from "../../../hooks/useRevenueCat";
import { usePaywall } from "../../../hooks/usePaywall";
import { PremiumBadge } from "../../../components/PremiumBadge";
import { Colors } from "../../../constants/colors";
import { api } from "../../../api/index";

export default function ProfileScreen() {
  const { user, onLogout } = useAuth();
  const { isPremium } = useRevenueCat();
  const { showPaywall } = usePaywall();
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.get("/api/logout");
    } catch {
      // ignore
    }
    onLogout();
  }

  // Teaser stats for Weekly Throne Report
  const deuceCount = user?.deuceCount ?? 0;
  const avgPerWeek = deuceCount > 0 ? Math.max(1, Math.round(deuceCount / 4)) : 0;

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(user?.username ?? user?.firstName ?? "?")[0].toUpperCase()}
        </Text>
      </View>
      <View style={styles.nameRow}>
        <Text style={styles.name}>
          {user?.username ?? user?.firstName ?? "Throne Philosopher"}
        </Text>
        {isPremium && <PremiumBadge />}
      </View>
      {user?.email ? (
        <Text style={styles.email}>{user.email}</Text>
      ) : null}
      {!isPremium && (
        <TouchableOpacity onPress={() => router.push("/premium")} activeOpacity={0.6} accessibilityLabel="Go Premium" accessibilityRole="button">
          <Text style={styles.goPremium}>Go Premium {"\uD83D\uDC51"}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{deuceCount}</Text>
          <Text style={styles.statLabel}>Total Deuces</Text>
        </View>
      </View>

      {/* Weekly Throne Report */}
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>{"\uD83D\uDCCA"} Weekly Throne Report</Text>

        {/* Teaser stats — always visible */}
        <View style={styles.reportRow}>
          <Text style={styles.reportStatLabel}>This week</Text>
          <Text style={styles.reportStatValue}>{avgPerWeek} deuces</Text>
        </View>
        <View style={styles.reportRow}>
          <Text style={styles.reportStatLabel}>Avg. per day</Text>
          <Text style={styles.reportStatValue}>
            {avgPerWeek > 0 ? (avgPerWeek / 7).toFixed(1) : "0"}
          </Text>
        </View>

        {/* Blurred premium section */}
        {!isPremium ? (
          <TouchableOpacity
            style={styles.reportBlurOverlay}
            onPress={() => showPaywall("premium_analytics")}
            activeOpacity={0.85}
            accessibilityLabel="See full weekly throne report"
            accessibilityHint="Unlock detailed analytics with Premium"
            accessibilityRole="button"
          >
            {/* Fake blurred rows underneath */}
            <View style={styles.reportBlurredContent} pointerEvents="none">
              <View style={styles.reportBlurRow} />
              <View style={[styles.reportBlurRow, { width: "60%" }]} />
              <View style={[styles.reportBlurRow, { width: "75%" }]} />
            </View>
            {/* Overlay CTA */}
            <View style={styles.reportBlurCta}>
              <Text style={styles.reportBlurCtaText}>
                See Full Report — Premium
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <View style={styles.reportRow}>
              <Text style={styles.reportStatLabel}>Peak hour</Text>
              <Text style={styles.reportStatValue}>9:00 AM</Text>
            </View>
            <View style={styles.reportRow}>
              <Text style={styles.reportStatLabel}>Longest streak</Text>
              <Text style={styles.reportStatValue}>--</Text>
            </View>
            <View style={styles.reportRow}>
              <Text style={styles.reportStatLabel}>Top location</Text>
              <Text style={styles.reportStatValue}>Home Base</Text>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/referral")}
        activeOpacity={0.7}
        accessibilityLabel="Refer friends"
        accessibilityRole="button"
      >
        <Text style={styles.settingsText}>Refer Friends {"\uD83C\uDF81"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => router.push("/settings")}
        activeOpacity={0.7}
        accessibilityLabel="Theme and settings"
        accessibilityRole="button"
      >
        <Text style={styles.settingsText}>Theme & Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} accessibilityLabel="Log out" accessibilityRole="button">
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  container: {
    alignItems: "center",
    paddingTop: 60,
    padding: 24,
    paddingBottom: 48,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brown,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: "bold", color: Colors.white },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  name: { fontSize: 24, fontWeight: "bold", color: Colors.espresso },
  email: { fontSize: 14, color: Colors.gray, marginBottom: 4 },
  goPremium: {
    fontSize: 14,
    color: Colors.gold,
    fontWeight: "600",
  },
  statRow: { flexDirection: "row", marginTop: 20, marginBottom: 24 },
  statBox: { alignItems: "center", paddingHorizontal: 24 },
  statNumber: { fontSize: 32, fontWeight: "bold", color: Colors.gold },
  statLabel: { fontSize: 13, color: Colors.secondaryText, marginTop: 4 },
  // Weekly Throne Report
  reportCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.espresso,
    marginBottom: 16,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  reportStatLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  reportStatValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.espresso,
  },
  reportBlurOverlay: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  reportBlurredContent: {
    opacity: 0.15,
    gap: 12,
    padding: 12,
  },
  reportBlurRow: {
    height: 14,
    backgroundColor: Colors.secondaryText,
    borderRadius: 7,
    width: "90%",
  },
  reportBlurCta: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 239, 224, 0.6)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  reportBlurCtaText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.gold,
  },
  // Buttons
  settingsButton: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  settingsText: { fontSize: 16, color: Colors.espresso, fontWeight: "600" },
  logoutButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  logoutText: { fontSize: 16, color: Colors.espresso, fontWeight: "600" },
});
