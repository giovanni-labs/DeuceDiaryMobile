import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../../hooks/useAuth";
import { useRevenueCat } from "../../../hooks/useRevenueCat";
import { PremiumBadge } from "../../../components/PremiumBadge";
import { Colors } from "../../../constants/colors";
import { api } from "../../../api/index";

export default function ProfileScreen() {
  const { user, onLogout } = useAuth();
  const { isPremium } = useRevenueCat();
  const router = useRouter();

  async function handleLogout() {
    try {
      await api.get("/api/logout");
    } catch {
      // ignore
    }
    onLogout();
  }

  return (
    <View style={styles.container}>
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
        <TouchableOpacity onPress={() => router.push("/premium")} activeOpacity={0.6}>
          <Text style={styles.goPremium}>Go Premium {"\uD83D\uDC51"}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{user?.deuceCount ?? 0}</Text>
          <Text style={styles.statLabel}>Total Deuces</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.cream,
    paddingTop: 60,
    padding: 24,
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
  statRow: { flexDirection: "row", marginTop: 20, marginBottom: 40 },
  statBox: { alignItems: "center", paddingHorizontal: 24 },
  statNumber: { fontSize: 32, fontWeight: "bold", color: Colors.gold },
  statLabel: { fontSize: 13, color: Colors.secondaryText, marginTop: 4 },
  logoutButton: {
    backgroundColor: Colors.lightGray,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  logoutText: { fontSize: 16, color: Colors.espresso, fontWeight: "600" },
});
