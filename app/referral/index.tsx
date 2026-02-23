import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Share,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "../../api/index";
import { Colors } from "../../constants/colors";

interface ReferralInfo {
  code: string;
  referralCount: number;
  referralLink: string;
}

export default function ReferralScreen() {
  const [applyCode, setApplyCode] = useState("");

  const { data: referral, isLoading } = useQuery<ReferralInfo>({
    queryKey: ["referral"],
    queryFn: async () => {
      const { data } = await api.get("/api/referral");
      return data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post("/api/referral/apply", {
        code: code.trim().toUpperCase(),
      });
      return data;
    },
    onSuccess: (data: any) => {
      Alert.alert(
        "Code applied!",
        `You and ${data.referrerUsername} are linked 🤌`
      );
      setApplyCode("");
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message || error.message || "Something went wrong.";
      Alert.alert("Couldn't apply code", msg);
    },
  });

  const handleShare = async () => {
    if (!referral) return;
    try {
      await Share.share({
        message: `Join me on Deuce Diary 🚽 Use my code ${referral.code} or link: ${referral.referralLink}`,
      });
    } catch {
      // user cancelled
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero */}
      <Text style={styles.emoji}>🎁</Text>
      <Text style={styles.title}>Refer Friends</Text>
      <Text style={styles.subtitle}>
        Share the throne. Spread the movement.
      </Text>

      {/* Code Card */}
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>YOUR CODE</Text>
        <Text style={styles.codeText}>{referral?.code}</Text>
        <Text style={styles.countText}>
          {referral?.referralCount === 0
            ? "No friends joined yet — share your code!"
            : `${referral?.referralCount} friend${referral?.referralCount === 1 ? "" : "s"} joined`}
        </Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Text style={styles.shareButtonText}>Share My Code</Text>
      </TouchableOpacity>

      {/* Apply a Code */}
      <View style={styles.applyCard}>
        <Text style={styles.applyLabel}>APPLY A CODE</Text>
        <View style={styles.applyRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter friend's code"
            placeholderTextColor={Colors.gray}
            value={applyCode}
            onChangeText={setApplyCode}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={[
              styles.applyButton,
              (!applyCode.trim() || applyMutation.isPending) &&
                styles.applyButtonDisabled,
            ]}
            onPress={() => applyMutation.mutate(applyCode)}
            disabled={!applyCode.trim() || applyMutation.isPending}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>
              {applyMutation.isPending ? "..." : "Apply"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: 24, paddingTop: 24, paddingBottom: 48 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cream,
  },
  emoji: { fontSize: 56, textAlign: "center", marginBottom: 12 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.espresso,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    textAlign: "center",
    marginBottom: 28,
  },
  codeCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.secondaryText,
    letterSpacing: 2,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.green,
    fontFamily: "Courier",
    letterSpacing: 4,
    marginBottom: 12,
  },
  countText: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  shareButton: {
    backgroundColor: Colors.green,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 24,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  applyCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  applyLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.secondaryText,
    letterSpacing: 2,
    marginBottom: 12,
  },
  applyRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.warmSand,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Courier",
    backgroundColor: Colors.cream,
    color: Colors.darkText,
  },
  applyButton: {
    backgroundColor: Colors.espresso,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: "center",
  },
  applyButtonDisabled: {
    opacity: 0.4,
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
