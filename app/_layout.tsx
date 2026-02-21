import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/queryClient";
import { useAuth, CLERK_ENABLED } from "../hooks/useAuth";
import { useDeepLink } from "../hooks/useDeepLink";
import { hasCompletedOnboarding } from "./onboarding";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

// Conditional Clerk imports — only used when the env var is set.
const ClerkProvider = CLERK_ENABLED
  ? require("@clerk/clerk-expo").ClerkProvider
  : null;
const tokenCache = CLERK_ENABLED
  ? require("@clerk/clerk-expo/token-cache").tokenCache
  : null;
const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Activate deep link listener
  useDeepLink();

  // Check onboarding status on mount
  useEffect(() => {
    hasCompletedOnboarding().then((completed) => {
      setNeedsOnboarding(!completed);
      setOnboardingChecked(true);
    });
  }, []);

  useEffect(() => {
    if (isLoading || !onboardingChecked) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboarding = segments[0] === "onboarding";
    const inInvite = segments[0] === "invite";

    // Let invite deep links through regardless of auth state
    if (inInvite) return;

    // Show onboarding on first launch (before auth)
    if (needsOnboarding && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      router.replace(
        CLERK_ENABLED ? "/auth/sign-in-clerk" : "/auth/sign-in"
      );
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, isLoading, segments, onboardingChecked, needsOnboarding]);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/sign-in" />
        <Stack.Screen name="auth/sign-in-clerk" />
        <Stack.Screen
          name="modals/log-a-deuce"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="invite/[code]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const inner = (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );

  if (ClerkProvider && CLERK_KEY) {
    return (
      <ClerkProvider publishableKey={CLERK_KEY} tokenCache={tokenCache}>
        {inner}
      </ClerkProvider>
    );
  }

  return inner;
}
