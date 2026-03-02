import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

/**
 * Error state with message + retry button.
 */
export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityLabel="Retry"
          accessibilityRole="button"
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: Colors.cream,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.espresso,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: Colors.green,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
