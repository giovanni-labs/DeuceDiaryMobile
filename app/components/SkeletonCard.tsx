import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Colors } from "../../constants/colors";

/**
 * Animated skeleton loader — gray pulsing blocks that mimic a feed card.
 */
export function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View style={styles.card} accessibilityLabel="Loading content">
      <View style={styles.header}>
        <View style={styles.row}>
          <Animated.View style={[styles.avatarBlock, { opacity }]} />
          <Animated.View style={[styles.nameBlock, { opacity }]} />
        </View>
        <Animated.View style={[styles.timeBlock, { opacity }]} />
      </View>
      <Animated.View style={[styles.lineWide, { opacity }]} />
      <Animated.View style={[styles.lineNarrow, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBlock: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.lightGray,
  },
  nameBlock: {
    width: 100,
    height: 14,
    backgroundColor: Colors.lightGray,
    borderRadius: 7,
    marginLeft: 10,
  },
  timeBlock: {
    width: 60,
    height: 12,
    backgroundColor: Colors.lightGray,
    borderRadius: 6,
  },
  lineWide: {
    width: "80%",
    height: 14,
    backgroundColor: Colors.lightGray,
    borderRadius: 7,
    marginTop: 12,
  },
  lineNarrow: {
    width: "50%",
    height: 14,
    backgroundColor: Colors.lightGray,
    borderRadius: 7,
    marginTop: 8,
  },
});
