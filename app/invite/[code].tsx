import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getGroupPreview, joinSquad } from "../../api/squads";
import { Colors } from "../../constants/colors";

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
  } = useQuery({
    queryKey: ["groupPreview", code],
    queryFn: () => getGroupPreview(code!),
    enabled: !!code,
  });

  async function handleJoin() {
    if (!code || joining) return;
    setJoining(true);
    try {
      await joinSquad(code);
      router.replace("/(tabs)/home" as any);
    } catch {
      setError("Could not join this squad. The invite may have expired.");
      setJoining(false);
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.espresso} />
        <Text style={styles.loadingText}>Loading invite...</Text>
      </View>
    );
  }

  // Error fetching preview
  if (isError || !preview) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>😕</Text>
        <Text style={styles.errorTitle}>Invalid Invite</Text>
        <Text style={styles.errorText}>
          This invite link is invalid or has expired.
        </Text>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.replace("/(tabs)/home" as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>👥</Text>
        <Text style={styles.groupName}>{preview.name}</Text>
        {preview.description ? (
          <Text style={styles.description}>{preview.description}</Text>
        ) : null}
        <Text style={styles.memberCount}>
          {preview.memberCount} {preview.memberCount === 1 ? "member" : "members"}
        </Text>
      </View>

      {error ? <Text style={styles.joinError}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.joinButton, joining && styles.joinButtonDisabled]}
        onPress={handleJoin}
        disabled={joining}
        activeOpacity={0.8}
      >
        {joining ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.joinButtonText}>Join the Squad</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => router.back()}
        activeOpacity={0.6}
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
  },
  joinButtonDisabled: {
    opacity: 0.6,
  },
  joinButtonText: {
    color: Colors.white,
    fontSize: 18,
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
