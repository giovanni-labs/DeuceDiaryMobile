import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/colors";
import type { ReactNode } from "react";

interface PremiumGateProps {
  featureName: string;
  children: ReactNode;
}

export function PremiumGate({ featureName, children }: PremiumGateProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Content shown dimmed underneath */}
      <View style={styles.blurred} pointerEvents="none">
        {children}
      </View>

      {/* Lock overlay */}
      <View style={styles.overlay}>
        <Text style={styles.icon}>{"\uD83D\uDC51"}</Text>
        <Text style={styles.title}>
          Unlock {featureName} with Premium
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/premium")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  blurred: {
    opacity: 0.25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(245, 239, 224, 0.7)",
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.espresso,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.green,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
