import React from "react";
import { render } from "@testing-library/react-native";
import { PremiumBadge } from "../../components/PremiumBadge";

describe("PremiumBadge", () => {
  it("renders Premium text with crown emoji", () => {
    const { getByText } = render(<PremiumBadge />);

    const badge = getByText(/Premium/);
    expect(badge).toBeTruthy();
    // Verify the crown emoji is included in the text content
    expect(badge.props.children).toContain("\uD83D\uDC51");
  });

  it("applies uppercase styling", () => {
    const { getByText } = render(<PremiumBadge />);

    const badge = getByText(/Premium/);
    const style = Array.isArray(badge.props.style)
      ? Object.assign({}, ...badge.props.style)
      : badge.props.style;
    expect(style.textTransform).toBe("uppercase");
  });
});
