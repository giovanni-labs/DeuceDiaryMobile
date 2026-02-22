import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api";
import { Colors } from "../../constants/colors";

interface LegacyData {
  totalLogs: number;
  longestStreak: number;
  bestDay: { date: string; count: number } | null;
  memberSince: string;
  title: string;
}

const TITLE_COLORS: Record<string, string> = {
  Rookie: Colors.gray,
  Regular: "#3B82F6",
  Veteran: "#8B5CF6",
  Elite: "#EAB308",
  Legend: "#F59E0B",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function LegacyScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useQuery<LegacyData>({
    queryKey: ["legacy", username],
    queryFn: async () => {
      const { data } = await api.get<LegacyData>(
        `/api/users/${encodeURIComponent(username!)}/legacy`
      );
      return data;
    },
    enabled: !!username,
  });

  const handleShare = async () => {
    const url = `https://deucediary.com/legacy/${username}`;
    try {
      await Share.share({ message: `Check out my Deuce Diary legacy! ${url}`, url });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      Alert.alert("Couldn't share", url);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>👻</Text>
        <Text style={styles.errorTitle}>Throne not found</Text>
        <Text style={styles.errorSub}>
          No legacy exists for "{username}"
        </Text>
      </View>
    );
  }

  const titleColor = TITLE_COLORS[data.title] || Colors.espresso;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Title badge */}
      <View style={styles.hero}>
        <Text style={{ fontSize: 56 }}>🏛️</Text>
        <Text style={styles.username}>@{username}</Text>
        <Text style={[styles.titleBadge, { color: titleColor }]}>
          {data.title}
        </Text>
      </View>

      {/* Stats grid */}
      <View style={styles.grid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>TOTAL LOGS</Text>
          <Text style={styles.statValue}>{data.totalLogs}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>LONGEST STREAK</Text>
          <Text style={styles.statValue}>{data.longestStreak}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>BEST DAY</Text>
          {data.bestDay ? (
            <>
              <Text style={[styles.statValue, { color: Colors.green }]}>
                {data.bestDay.count}
              </Text>
              <Text style={styles.statSub}>
                {formatDate(data.bestDay.date)}
              </Text>
            </>
          ) : (
            <Text style={styles.statSub}>—</Text>
          )}
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>MEMBER SINCE</Text>
          <Text style={styles.memberSince}>
            {formatDate(data.memberSince)}
          </Text>
        </View>
      </View>

      {/* Share button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Text style={styles.shareText}>
          {copied ? "Copied! ✅" : "Share My Legacy 🚽"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: 20, paddingBottom: 60 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.espresso,
    marginBottom: 6,
  },
  errorSub: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  hero: {
    alignItems: "center",
    marginBottom: 28,
    marginTop: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.espresso,
    marginTop: 12,
    marginBottom: 4,
  },
  titleBadge: {
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    width: "47%",
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.secondaryText,
    letterSpacing: 1,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.espresso,
  },
  statSub: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.espresso,
    textAlign: "center",
  },
  shareButton: {
    backgroundColor: Colors.green,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
});
