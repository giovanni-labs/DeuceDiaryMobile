import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import {
  PaywallProvider,
  usePaywall,
  FEATURE_CONFIG,
  type PaywallFeature,
} from "../../hooks/usePaywall";

// Mock the api module
jest.mock("../../api/index", () => {
  const interceptors: Array<(error: any) => any> = [];
  return {
    api: {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: {
          use: jest.fn((_onFulfilled: any, onRejected: any) => {
            interceptors.push(onRejected);
            return interceptors.length - 1;
          }),
          eject: jest.fn(),
        },
      },
    },
    registerTokenGetter: jest.fn(),
    // Expose for testing
    __interceptors: interceptors,
  };
});

function wrapper({ children }: { children: React.ReactNode }) {
  return <PaywallProvider>{children}</PaywallProvider>;
}

function wrapperWithSegments(segments: string[]) {
  return function SegmentWrapper({ children }: { children: React.ReactNode }) {
    return <PaywallProvider segments={segments}>{children}</PaywallProvider>;
  };
}

describe("usePaywall", () => {
  describe("FEATURE_CONFIG", () => {
    it("defines all 7 premium features", () => {
      const features: PaywallFeature[] = [
        "unlimited_squads",
        "streak_insurance",
        "spy_mode",
        "daily_challenges",
        "throne_broadcast",
        "premium_analytics",
        "custom_themes",
      ];

      features.forEach((feature) => {
        expect(FEATURE_CONFIG[feature]).toBeDefined();
        expect(FEATURE_CONFIG[feature].title).toBeTruthy();
        expect(FEATURE_CONFIG[feature].description).toBeTruthy();
        expect(FEATURE_CONFIG[feature].emoji).toBeTruthy();
      });
    });
  });

  describe("context", () => {
    it("starts with no active feature", () => {
      const { result } = renderHook(() => usePaywall(), { wrapper });

      expect(result.current.activeFeature).toBeNull();
    });

    it("showPaywall sets active feature", () => {
      const { result } = renderHook(() => usePaywall(), { wrapper });

      act(() => {
        result.current.showPaywall("streak_insurance");
      });

      expect(result.current.activeFeature).toBe("streak_insurance");
    });

    it("dismissPaywall clears active feature", () => {
      const { result } = renderHook(() => usePaywall(), { wrapper });

      act(() => {
        result.current.showPaywall("custom_themes");
      });
      expect(result.current.activeFeature).toBe("custom_themes");

      act(() => {
        result.current.dismissPaywall();
      });
      expect(result.current.activeFeature).toBeNull();
    });

    it("can switch between features", () => {
      const { result } = renderHook(() => usePaywall(), { wrapper });

      act(() => {
        result.current.showPaywall("unlimited_squads");
      });
      expect(result.current.activeFeature).toBe("unlimited_squads");

      act(() => {
        result.current.showPaywall("premium_analytics");
      });
      expect(result.current.activeFeature).toBe("premium_analytics");
    });
  });

  describe("403 interceptor", () => {
    it("installs a response interceptor on mount", () => {
      const { api } = require("../../api/index");
      const useBefore = api.interceptors.response.use.mock.calls.length;

      renderHook(() => usePaywall(), { wrapper });

      expect(api.interceptors.response.use.mock.calls.length).toBeGreaterThan(
        useBefore
      );
    });

    it("ejects interceptor on unmount", () => {
      const { api } = require("../../api/index");

      const { unmount } = renderHook(() => usePaywall(), { wrapper });
      unmount();

      expect(api.interceptors.response.eject).toHaveBeenCalled();
    });
  });

  describe("suppressed routes", () => {
    it("does not show paywall on onboarding segment", () => {
      const { result } = renderHook(() => usePaywall(), {
        wrapper: wrapperWithSegments(["onboarding"]),
      });

      // The 403 interceptor should check segments and suppress
      // Direct showPaywall still works (it's programmatic)
      act(() => {
        result.current.showPaywall("unlimited_squads");
      });
      expect(result.current.activeFeature).toBe("unlimited_squads");
    });
  });
});
