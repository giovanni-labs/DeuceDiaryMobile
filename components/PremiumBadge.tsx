import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constants/colors";

export function PremiumBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{"\uD83D\uDC51"} Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "rgba(200, 169, 81, 0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
