import React from "react";
import { Text } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { PremiumGate } from "../../components/PremiumGate";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("PremiumGate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the feature name in the title", () => {
    const { getByText } = render(
      <PremiumGate featureName="Custom Themes">
        <Text>Content</Text>
      </PremiumGate>
    );

    expect(getByText(/Unlock Custom Themes with Premium/)).toBeTruthy();
  });

  it("renders children dimmed underneath", () => {
    const { getByText } = render(
      <PremiumGate featureName="Spy Mode">
        <Text>Secret Content</Text>
      </PremiumGate>
    );

    expect(getByText("Secret Content")).toBeTruthy();
  });

  it("has an Upgrade button", () => {
    const { getByText } = render(
      <PremiumGate featureName="Analytics">
        <Text>Chart</Text>
      </PremiumGate>
    );

    expect(getByText("Upgrade to Premium")).toBeTruthy();
  });

  it("navigates to /premium on button press", () => {
    const { getByText } = render(
      <PremiumGate featureName="Feature">
        <Text>Content</Text>
      </PremiumGate>
    );

    fireEvent.press(getByText("Upgrade to Premium"));
    expect(mockPush).toHaveBeenCalledWith("/premium");
  });
});
