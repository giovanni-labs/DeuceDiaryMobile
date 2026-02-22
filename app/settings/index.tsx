import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
import { useAuth } from "../../hooks/useAuth";
import { useRevenueCat } from "../../hooks/useRevenueCat";
import { api } from "../../api/index";

type ThemeName = "default" | "dark" | "cream" | "midnight";

const THEME_STORAGE_KEY = "userTheme";

const THEMES: {
  id: ThemeName;
  name: string;
  color: string;
  premium: boolean;
}[] = [
  { id: "default", name: "Default", color: "#141414", premium: false },
  { id: "cream", name: "Cream", color: "#F5F0E8", premium: true },
  { id: "dark", name: "Dark", color: "#141C29", premium: false },
  { id: "midnight", name: "Midnight", color: "#170E1A", premium: true },
];

export default function SettingsScreen() {
  const [activeTheme, setActiveTheme] = useState<ThemeName>("default");
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  const { isPremium } = useRevenueCat();
  const router = useRouter();

  // Load theme on mount
  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await api.get<{ theme: ThemeName }>("/api/user/theme");
        if (res.data.theme) {
          setActiveTheme(res.data.theme);
          await AsyncStorage.setItem(THEME_STORAGE_KEY, res.data.theme);
        }
      } catch {
        // Fallback to AsyncStorage
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored) setActiveTheme(stored as ThemeName);
      }
    }
    loadTheme();
  }, []);

  async function handleSelect(theme: typeof THEMES[number]) {
    if (theme.premium && !isPremium) {
      router.push("/premium");
      return;
    }

    setSaving(true);
    try {
      await api.put("/api/user/theme", { theme: theme.id });
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme.id);
      setActiveTheme(theme.id);
      Alert.alert("Theme updated");
    } catch {
      Alert.alert("Error", "Failed to update theme. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Theme</Text>
      <Text style={styles.subtitle}>Choose your throne aesthetic</Text>

      {THEMES.map((t) => {
        const isActive = activeTheme === t.id;
        const isLocked = t.premium && !isPremium;

        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.row, isActive && styles.rowActive]}
            onPress={() => handleSelect(t)}
            disabled={saving}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: t.color },
                isActive && styles.swatchActive,
              ]}
            />
            <Text style={[styles.themeName, isActive && styles.themeNameActive]}>
              {t.name}
            </Text>
            {isLocked && <Text style={styles.crown}>👑</Text>}
            {isActive && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.espresso,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 28,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.lightGray,
  },
  rowActive: {
    borderColor: Colors.green,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  swatchActive: {
    borderColor: Colors.green,
    borderWidth: 2,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.espresso,
  },
  themeNameActive: {
    color: Colors.green,
  },
  crown: {
    fontSize: 18,
    marginRight: 4,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.green,
  },
});
