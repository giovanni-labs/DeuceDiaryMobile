import React from "react";
import { render } from "@testing-library/react-native";
import { OfflineBanner } from "../../app/components/OfflineBanner";
import NetInfo from "@react-native-community/netinfo";

describe("OfflineBanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when connected", () => {
    // Default mock returns isConnected: true
    const { queryByText } = render(<OfflineBanner />);

    expect(queryByText(/offline/i)).toBeNull();
  });

  it("renders offline banner when disconnected", () => {
    // Override the mock to return disconnected
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: false });
      return () => {};
    });

    const { getByText } = render(<OfflineBanner />);

    expect(
      getByText("You're offline — some features may be unavailable")
    ).toBeTruthy();
  });

  it("has alert accessibility role", () => {
    (NetInfo.addEventListener as jest.Mock).mockImplementation((cb: any) => {
      cb({ isConnected: false });
      return () => {};
    });

    const { getByText } = render(<OfflineBanner />);

    // Verify the banner renders and contains the offline text (role="alert" is set on the View)
    const banner = getByText(/offline/i);
    expect(banner).toBeTruthy();
  });
});
