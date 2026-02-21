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
import { login } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { Colors } from "../../constants/colors";

export default function SignInScreen() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { onLoginSuccess } = useAuth();

  async function handleLogin() {
    const name = username.trim();
    if (!name) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    setLoading(true);
    try {
      await login(name);
      onLoginSuccess();
      router.replace("/(tabs)/home");
    } catch (error) {
      Alert.alert(
        "Oops",
        "Failed to enter the Throne Room. Check your connection and try again."
      );
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
          placeholder="Enter your username"
          placeholderTextColor={Colors.gray}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Enter the Throne Room</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
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
    color: Colors.espresso,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    color: Colors.secondaryText,
    marginBottom: 56,
    fontStyle: "italic",
  },
  input: {
    width: "100%",
    borderWidth: 1.5,
    borderColor: Colors.warmSand,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: Colors.white,
    color: Colors.darkText,
  },
  button: {
    backgroundColor: Colors.green,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});
