import React from "react";
import { render, act } from "@testing-library/react-native";
import { PaywallModal } from "../../app/components/PaywallModal";
import {
  PaywallProvider,
  FEATURE_CONFIG,
} from "../../hooks/usePaywall";

// Mock useRevenueCat
const mockPurchaseMonthly = jest.fn().mockResolvedValue({ success: true });
const mockPurchaseAnnual = jest.fn().mockResolvedValue({ success: true });

jest.mock("../../hooks/useRevenueCat", () => ({
  useRevenueCat: () => ({
    isPremium: false,
    isLoading: false,
    purchaseMonthly: mockPurchaseMonthly,
    purchaseAnnual: mockPurchaseAnnual,
    restorePurchases: jest.fn(),
  }),
}));

jest.mock("../../api/index", () => ({
  api: {
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn(() => 0), eject: jest.fn() },
    },
  },
  registerTokenGetter: jest.fn(),
}));

function renderWithPaywall(feature: string | null) {
  let showPaywallFn: any;

  function Consumer() {
    const ctx = require("../../hooks/usePaywall").usePaywall();
    showPaywallFn = ctx.showPaywall;
    return null;
  }

  const result = render(
    <PaywallProvider>
      <Consumer />
      <PaywallModal />
    </PaywallProvider>
  );

  if (feature) {
    act(() => {
      showPaywallFn(feature);
    });
  }

  return { ...result, showPaywall: showPaywallFn };
}

describe("PaywallModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when no active feature", () => {
    const { queryByText } = renderWithPaywall(null);

    expect(queryByText("Porcelain Premium")).toBeNull();
  });

  it("renders feature title for streak_insurance", () => {
    const { getByText } = renderWithPaywall("streak_insurance");

    expect(getByText(FEATURE_CONFIG.streak_insurance.title)).toBeTruthy();
  });

  it("renders feature description", () => {
    const { getByText } = renderWithPaywall("unlimited_squads");

    expect(getByText(FEATURE_CONFIG.unlimited_squads.description)).toBeTruthy();
  });

  it("shows all 6 premium feature labels", () => {
    const { getByText } = renderWithPaywall("custom_themes");

    expect(getByText("Unlimited Squads")).toBeTruthy();
    expect(getByText("Streak Insurance")).toBeTruthy();
    expect(getByText("Custom Themes")).toBeTruthy();
    expect(getByText("Throne Analytics")).toBeTruthy();
    expect(getByText("Daily Challenges")).toBeTruthy();
    expect(getByText("Spy Mode")).toBeTruthy();
  });

  it("shows annual and monthly pricing", () => {
    const { getByText } = renderWithPaywall("premium_analytics");

    expect(getByText(/Annual/)).toBeTruthy();
    expect(getByText(/Monthly/)).toBeTruthy();
  });

  it("shows Save 44% badge", () => {
    const { getByText } = renderWithPaywall("premium_analytics");

    expect(getByText("Save 44%")).toBeTruthy();
  });

  it("shows cancel anytime disclaimer", () => {
    const { getByText } = renderWithPaywall("spy_mode");

    expect(getByText("Cancel anytime. Recurring billing.")).toBeTruthy();
  });

  it("has a close button", () => {
    const { getByLabelText } = renderWithPaywall("daily_challenges");

    expect(getByLabelText("Close")).toBeTruthy();
  });
});
