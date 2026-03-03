import { renderHook, act } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import { __mockRouter } from "expo-router";

import { useDeepLink } from "../../hooks/useDeepLink";

// Store original getInitialURL so we can swap per-test
const originalGetInitialURL = Linking.getInitialURL;

describe("useDeepLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset getInitialURL to default (resolves null)
    (Linking as any).getInitialURL = originalGetInitialURL;
  });

  afterEach(() => {
    (Linking as any).getInitialURL = originalGetInitialURL;
  });

  it("navigates to /invite/:code on cold start with invite URL", async () => {
    // Override getInitialURL to simulate a cold-start invite link
    (Linking as any).getInitialURL = () =>
      Promise.resolve("deucediary://invite/abc123");

    renderHook(() => useDeepLink());

    // Wait for the getInitialURL promise to resolve
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(__mockRouter.push).toHaveBeenCalledWith("/invite/abc123");
  });

  it("navigates to /invite/:code on warm start URL event", () => {
    renderHook(() => useDeepLink());

    // Simulate a URL arriving while the app is running
    act(() => {
      (Linking as any).__simulateURL("https://deucediary.app/invite/xyz789");
    });

    expect(__mockRouter.push).toHaveBeenCalledWith("/invite/xyz789");
  });

  it("ignores non-invite URLs", () => {
    renderHook(() => useDeepLink());

    act(() => {
      (Linking as any).__simulateURL("https://deucediary.app/profile/settings");
    });

    expect(__mockRouter.push).not.toHaveBeenCalled();
  });

  it("cleans up event listener on unmount", () => {
    const { unmount } = renderHook(() => useDeepLink());

    unmount();

    // After unmount, simulated URLs should not trigger navigation
    (Linking as any).__simulateURL("deucediary://invite/after-unmount");
    expect(__mockRouter.push).not.toHaveBeenCalled();
  });

  it("handles invite link with no code gracefully", () => {
    renderHook(() => useDeepLink());

    act(() => {
      (Linking as any).__simulateURL("deucediary://invite/");
    });

    expect(__mockRouter.push).not.toHaveBeenCalled();
  });

  it("does not navigate when cold start URL is null", async () => {
    // Default getInitialURL returns null
    renderHook(() => useDeepLink());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(__mockRouter.push).not.toHaveBeenCalled();
  });

  it("handles both custom scheme and HTTPS universal links", () => {
    renderHook(() => useDeepLink());

    act(() => {
      (Linking as any).__simulateURL("deucediary://invite/custom-scheme");
    });
    expect(__mockRouter.push).toHaveBeenCalledWith("/invite/custom-scheme");

    __mockRouter.push.mockClear();

    act(() => {
      (Linking as any).__simulateURL(
        "https://deucediary.app/invite/universal-link"
      );
    });
    expect(__mockRouter.push).toHaveBeenCalledWith("/invite/universal-link");
  });
});
