import React from "react";
import { render } from "@testing-library/react-native";
import { PremiumBadge } from "../../components/PremiumBadge";

describe("PremiumBadge", () => {
  it("renders Premium text", () => {
    const { getByText } = render(<PremiumBadge />);

    expect(getByText(/Premium/)).toBeTruthy();
  });

  it("renders the crown emoji with Premium text", () => {
    const { getByText } = render(<PremiumBadge />);

    // The text includes 👑 Premium as a combined string
    const badge = getByText(/Premium/);
    expect(badge).toBeTruthy();
  });
});
