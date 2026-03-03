import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// The hook uses IS_DEV which is true when REVENUECAT_KEY === "placeholder"
// In test env, the env var is not set, so IS_DEV will be true

jest.mock("../../api/index", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
  registerTokenGetter: jest.fn(),
}));

jest.mock("../../services/revenuecat", () => ({
  configure: jest.fn(),
  getCustomerInfo: jest.fn(),
  syncWithBackend: jest.fn(),
}));

describe("useRevenueCat (dev mode)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage as any).__store["dev_premium"] = undefined;
    delete (AsyncStorage as any).__store["dev_premium"];
  });

  it("starts with isPremium false and isLoading true in dev mode", async () => {
    const { useRevenueCat } = require("../../hooks/useRevenueCat");
    const { result } = renderHook(() => useRevenueCat());

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isPremium).toBe(false);
  });

  it("reads premium status from AsyncStorage in dev mode", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");

    const { useRevenueCat } = require("../../hooks/useRevenueCat");
    const { result } = renderHook(() => useRevenueCat());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isPremium).toBe(true);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("dev_premium");
  });

  it("purchaseMonthly sets premium in dev mode", async () => {
    const { useRevenueCat } = require("../../hooks/useRevenueCat");
    const { result } = renderHook(() => useRevenueCat());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let purchaseResult: any;
    await act(async () => {
      purchaseResult = await result.current.purchaseMonthly();
    });

    expect(purchaseResult.success).toBe(true);
    expect(result.current.isPremium).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("dev_premium", "true");
  });

  it("purchaseAnnual sets premium in dev mode", async () => {
    const { useRevenueCat } = require("../../hooks/useRevenueCat");
    const { result } = renderHook(() => useRevenueCat());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let purchaseResult: any;
    await act(async () => {
      purchaseResult = await result.current.purchaseAnnual();
    });

    expect(purchaseResult.success).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it("restorePurchases reflects stored state in dev mode", async () => {
    const { useRevenueCat } = require("../../hooks/useRevenueCat");
    const { result } = renderHook(() => useRevenueCat());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // No stored premium
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
    let restoreResult: any;
    await act(async () => {
      restoreResult = await result.current.restorePurchases();
    });
    expect(restoreResult.success).toBe(false);

    // With stored premium
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("true");
    await act(async () => {
      restoreResult = await result.current.restorePurchases();
    });
    expect(restoreResult.success).toBe(true);
  });
});
