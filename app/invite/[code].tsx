import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getGroupPreview, joinSquad } from "../../api/squads";
import { Colors } from "../../constants/colors";

/**
 * Fallback: When the app is not installed and a user taps an invite link,
 * the web domain (deucediary.app) should serve an AASA file and a fallback
 * page that redirects to the App Store. This constant is used if we ever
 * need to open the store listing from within the app.
 */
const APP_STORE_URL = Platform.select({
  ios: "https://apps.apple.com/app/deuce-diary/id0000000000",
  android:
    "https://play.google.com/store/apps/details?id=com.deucediary.mobile",
  default: "https://deucediary.app",
});

/** Invite preview screen — shows group info before joining */
export default function InvitePreviewScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    data: preview,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["groupPreview", code],
    queryFn: () => getGroupPreview(code!),
    enabled: !!code,
    retry: 1,
  });

  async function handleJoin() {
    if (!code || joining) return;
    setJoining(true);
    setError(null);
    try {
      await joinSquad(code);
      router.replace("/(tabs)/home" as any);
    } catch {
      setError("Could not join this squad. The invite may have expired.");
      setJoining(false);
    }
  }

  async function handleShareLink() {
    const url = `https://deucediary.app/invite/${code}`;
    try {
      const { Share } = require("react-native");
      await Share.share({
        message: `Join my squad on Deuce Diary! ${url}`,
        url,
      });
    } catch {
      // User cancelled or share failed
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container} accessibilityLabel="Loading invite preview">
        <ActivityIndicator size="large" color={Colors.espresso} />
        <Text style={styles.loadingText}>Loading invite...</Text>
      </View>
    );
  }

  // Error fetching preview
  if (isError || !preview) {
    return (
      <View style={styles.container} accessibilityLabel="Invalid invite">
        <Text style={styles.emoji} accessibilityElementsHidden>
          {"\uD83D\uDE15"}
        </Text>
        <Text style={styles.errorTitle}>Invalid Invite</Text>
        <Text style={styles.errorText}>
          This invite link is invalid or has expired.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => refetch()}
          activeOpacity={0.7}
          accessibilityLabel="Retry loading invite"
          accessibilityRole="button"
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/(tabs)/home" as any)}
          activeOpacity={0.7}
          accessibilityLabel="Go to home screen"
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container} accessibilityLabel={`Invite to join ${preview.name}`}>
      <View style={styles.card}>
        <Text style={styles.emoji} accessibilityElementsHidden>
          {"\uD83D\uDC65"}
        </Text>
        <Text style={styles.inviteLabel}>You've been invited to</Text>
        <Text style={styles.groupName}>{preview.name}</Text>
        {preview.description ? (
          <Text style={styles.description}>{preview.description}</Text>
        ) : null}
        <Text style={styles.memberCount}>
          {preview.memberCount}{" "}
          {preview.memberCount === 1 ? "member" : "members"}
        </Text>
      </View>

      {error ? (
        <Text style={styles.joinError} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.joinButton, joining && styles.joinButtonDisabled]}
        onPress={handleJoin}
        disabled={joining}
        activeOpacity={0.8}
        accessibilityLabel={`Join ${preview.name} squad`}
        accessibilityRole="button"
      >
        {joining ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.joinButtonText}>Join the Squad</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShareLink}
        activeOpacity={0.7}
        accessibilityLabel="Share invite link"
        accessibilityRole="button"
      >
        <Text style={styles.shareButtonText}>
          Share Invite Link
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.back()}
        activeOpacity={0.6}
        accessibilityLabel="Cancel and go back"
        accessibilityRole="button"
      >
        <Text style={styles.secondaryButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
    padding: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    shadowColor: Colors.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  inviteLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.secondaryText,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.espresso,
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 12,
  },
  memberCount: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.espresso,
    marginTop: 12,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 24,
  },
  joinError: {
    fontSize: 14,
    color: "#CC3333",
    textAlign: "center",
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: Colors.green,
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 999,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  shareButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.warmSand,
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  shareButtonText: {
    color: Colors.espresso,
    fontSize: 15,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: Colors.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 999,
    marginBottom: 12,
  },
  retryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: "500",
  },
});
