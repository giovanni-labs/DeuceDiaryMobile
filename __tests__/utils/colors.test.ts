import { Colors } from "../../constants/colors";

describe("Colors", () => {
  it("exports the Porcelain Premium color palette", () => {
    expect(Colors.cream).toBe("#F5EFE0");
    expect(Colors.espresso).toBe("#1A0F00");
    expect(Colors.green).toBe("#2D8A4E");
    expect(Colors.gold).toBe("#C8A951");
    expect(Colors.white).toBe("#FFFFFF");
    expect(Colors.gray).toBe("#8E8E93");
    expect(Colors.lightGray).toBe("#E5E5EA");
    expect(Colors.warmSand).toBe("#D4C5A9");
    expect(Colors.darkText).toBe("#1A0F00");
    expect(Colors.secondaryText).toBe("#636366");
    expect(Colors.brown).toBe("#6B4226");
  });

  it("has 11 color values", () => {
    expect(Object.keys(Colors)).toHaveLength(11);
  });

  it("all values are valid hex colors", () => {
    Object.values(Colors).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it("darkText matches espresso (alias)", () => {
    expect(Colors.darkText).toBe(Colors.espresso);
  });
});
