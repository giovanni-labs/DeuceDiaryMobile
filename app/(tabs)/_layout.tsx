import { Tabs, useRouter } from "expo-router";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.green,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.cream,
          borderTopColor: Colors.warmSand,
          borderTopWidth: 0.5,
          height: 88,
          paddingBottom: 28,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
        headerStyle: { backgroundColor: Colors.cream },
        headerTintColor: Colors.espresso,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
              🏠
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="squads/index"
        options={{
          title: "Squads",
          tabBarLabel: "Squads",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
              👥
            </Text>
          ),
        }}
      />
      {/* Center Log button — elevated green circle */}
      <Tabs.Screen
        name="log"
        options={{
          tabBarLabel: () => null,
          tabBarButton: () => (
            <Pressable
              style={styles.logButtonContainer}
              onPress={() => router.push("/modals/log-a-deuce")}
            >
              <View style={styles.logButton}>
                <Text style={styles.logEmoji}>🚽</Text>
              </View>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>
              👤
            </Text>
          ),
        }}
      />
      {/* Hide nested squad detail from tab bar */}
      <Tabs.Screen
        name="squads/[squadId]"
        options={{ href: null }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  logButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.green,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  logEmoji: {
    fontSize: 26,
  },
});
