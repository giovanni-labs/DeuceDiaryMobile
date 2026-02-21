import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  type ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/colors";

const { width } = Dimensions.get("window");

const ONBOARDING_KEY = "deucediary_onboarding_complete";

interface Slide {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
}

const slides: Slide[] = [
  {
    id: "1",
    emoji: "🚽",
    title: "Track Every Throne Session",
    subtitle: "Because every deuce deserves recognition",
  },
  {
    id: "2",
    emoji: "👥",
    title: "Build Your Squad",
    subtitle: "Compete, streak, and never deuce alone",
  },
  {
    id: "3",
    emoji: "🔥",
    title: "Keep the Streak Alive",
    subtitle: "Daily accountability. Gold badges. Pure glory.",
  },
];

/** Mark onboarding as complete in AsyncStorage */
export async function completeOnboarding() {
  await AsyncStorage.setItem(ONBOARDING_KEY, "true");
}

/** Check if onboarding has been completed */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === "true";
}

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Slide>[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isLastSlide = currentIndex === slides.length - 1;

  async function handleGetStarted() {
    await completeOnboarding();
    router.replace("/auth/sign-in" as any);
  }

  function handleNext() {
    if (isLastSlide) {
      handleGetStarted();
    } else {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  }

  function handleSkip() {
    handleGetStarted();
  }

  function renderSlide({ item }: { item: Slide }) {
    return (
      <View style={styles.slide}>
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Pagination dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        {!isLastSlide ? (
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.6}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.espresso,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.secondaryText,
    textAlign: "center",
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warmSand,
  },
  dotActive: {
    backgroundColor: Colors.gold,
    width: 24,
    borderRadius: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  skipText: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: Colors.green,
    paddingVertical: 16,
    paddingHorizontal: 36,
    borderRadius: 999,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
