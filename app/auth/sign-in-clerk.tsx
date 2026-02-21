import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useAuth } from "../../hooks/useAuth";

/** Porcelain Premium palette (spec: cream bg, espresso text, green CTA) */
const PP = {
  cream: "hsl(38, 40%, 96%)",
  espresso: "hsl(25, 30%, 8%)",
  green: "#2D8A4E",
  white: "#FFFFFF",
  gray: "#8E8E93",
  warmSand: "#D4C5A9",
  secondaryText: "#636366",
} as const;

export default function SignInClerkScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { onLoginSuccess } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert("Error", "Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: trimmedEmail,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        onLoginSuccess();
        router.replace("/(tabs)/home");
      } else {
        // Multi-factor or other intermediate status
        Alert.alert(
          "Additional verification required",
          "Please complete verification in your Clerk dashboard settings."
        );
      }
    } catch (err: any) {
      const msg =
        err?.errors?.[0]?.longMessage ??
        err?.errors?.[0]?.message ??
        "Sign-in failed. Check your credentials and try again.";
      Alert.alert("Sign-in failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.emoji}>🚽</Text>
        <Text style={styles.title}>Deuce Diary</Text>
        <Text style={styles.tagline}>Drop a thought. Leave a mark.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={PP.gray}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={PP.gray}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          returnKeyType="go"
          onSubmitEditing={handleSignIn}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading || !isLoaded}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={PP.white} />
          ) : (
            <Text style={styles.buttonText}>Enter the Throne Room</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PP.cream },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emoji: { fontSize: 80, marginBottom: 20 },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: PP.espresso,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    color: PP.secondaryText,
    marginBottom: 56,
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: PP.warmSand,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: PP.white,
    color: PP.espresso,
  },
  button: {
    backgroundColor: PP.green,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: PP.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
