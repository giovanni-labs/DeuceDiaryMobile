import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import WidgetPreviewScreen from "../../app/settings/widget-preview";

describe("WidgetPreviewScreen", () => {
  it("renders the title and subtitle", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText("Home Screen Widget")).toBeTruthy();
    expect(getByText(/See your streak at a glance/)).toBeTruthy();
  });

  it("displays Coming Soon badge", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText("Coming Soon")).toBeTruthy();
  });

  it("renders active streak widget mockups with streak numbers", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    // 14-day and 7-day active previews
    expect(getByText("14")).toBeTruthy();
    expect(getByText("7")).toBeTruthy();
    expect(getByText("14-day streak")).toBeTruthy();
    expect(getByText("7-day streak")).toBeTruthy();
  });

  it("renders milestone tier widget mockups", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    // 30-day diamond and 3-day bronze
    expect(getByText("30")).toBeTruthy();
    expect(getByText("30-day streak")).toBeTruthy();
    expect(getByText("3-day streak")).toBeTruthy();
  });

  it("renders inactive streak widget mockup", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText("No active streak")).toBeTruthy();
    expect(getByText("No logs yet")).toBeTruthy();
  });

  it("displays Deuce Diary branding on widgets", () => {
    const { getAllByText } = render(<WidgetPreviewScreen />);
    const brandLabels = getAllByText("Deuce Diary");
    // 5 widget mockups, each with branding
    expect(brandLabels.length).toBe(5);
  });

  it("shows setup instructions with 4 steps", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText("How it will work")).toBeTruthy();
    expect(getByText(/Long-press your iOS home screen/)).toBeTruthy();
    expect(getByText(/Tap the \+ button/)).toBeTruthy();
    expect(getByText(/Search for "Deuce Diary"/)).toBeTruthy();
    expect(getByText(/Your streak updates automatically/)).toBeTruthy();
  });

  it("renders iOS 16 requirement footnote", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText(/iOS 16\+/)).toBeTruthy();
  });

  it("has correct accessibility labels on widget mockups", () => {
    const { getByLabelText } = render(<WidgetPreviewScreen />);
    expect(getByLabelText(/Widget preview showing 14-day streak/)).toBeTruthy();
    expect(getByLabelText(/Widget preview showing 0-day streak/)).toBeTruthy();
  });

  it("renders section labels", () => {
    const { getByText } = render(<WidgetPreviewScreen />);
    expect(getByText("Active Streak")).toBeTruthy();
    expect(getByText("Milestone Tiers")).toBeTruthy();
    expect(getByText("No Active Streak")).toBeTruthy();
  });
});
