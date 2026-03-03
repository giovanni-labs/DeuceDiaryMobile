import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { __mockRouter } from "expo-router";

// Mock dependencies
jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "1", username: "tester" } }),
}));
jest.mock("../../hooks/useRevenueCat", () => ({
  useRevenueCat: () => ({ isPremium: false }),
}));
jest.mock("../../hooks/usePaywall", () => ({
  usePaywall: () => ({ showPaywall: jest.fn() }),
}));
jest.mock("../../api/index", () => ({
  api: { get: jest.fn().mockResolvedValue({ data: { theme: "default" } }), put: jest.fn() },
}));

import SettingsScreen from "../../app/settings/index";

describe("Settings — Widget Link", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the Home Screen Widget link", () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText("Home Screen Widget")).toBeTruthy();
    expect(getByText("Coming Soon")).toBeTruthy();
  });

  it("navigates to widget preview on press", () => {
    const { getByLabelText } = render(<SettingsScreen />);
    const widgetLink = getByLabelText("Coming soon: home screen widget");
    fireEvent.press(widgetLink);
    expect(__mockRouter.push).toHaveBeenCalledWith("/settings/widget-preview");
  });

  it("has correct accessibility attributes", () => {
    const { getByLabelText } = render(<SettingsScreen />);
    const widgetLink = getByLabelText("Coming soon: home screen widget");
    expect(widgetLink).toBeTruthy();
  });
});
