import { View, Text, StyleSheet } from "react-native";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

/**
 * Yellow banner shown app-wide when the device is offline.
 */
export function OfflineBanner() {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>You're offline — some features may be unavailable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#FFC107",
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A0F00",
    textAlign: "center",
  },
});
