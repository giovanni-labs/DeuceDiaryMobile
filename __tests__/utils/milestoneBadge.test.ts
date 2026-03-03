// Test the getMilestoneBadge and getMilestoneLabel utility functions
// from SquadDetailScreen

function getMilestoneBadge(streak: number): string {
  if (streak >= 30) return "💎";
  if (streak >= 14) return "🥇";
  if (streak >= 7) return "🥈";
  if (streak >= 3) return "🥉";
  return "";
}

function getMilestoneLabel(streak: number): string {
  if (streak >= 30) return "Diamond tier";
  if (streak >= 14) return "Gold tier";
  if (streak >= 7) return "Silver tier";
  if (streak >= 3) return "Bronze tier";
  return "";
}

describe("getMilestoneBadge", () => {
  it("returns empty string for streak 0", () => {
    expect(getMilestoneBadge(0)).toBe("");
  });

  it("returns empty string for streak 1-2", () => {
    expect(getMilestoneBadge(1)).toBe("");
    expect(getMilestoneBadge(2)).toBe("");
  });

  it("returns bronze for streak 3-6", () => {
    expect(getMilestoneBadge(3)).toBe("🥉");
    expect(getMilestoneBadge(6)).toBe("🥉");
  });

  it("returns silver for streak 7-13", () => {
    expect(getMilestoneBadge(7)).toBe("🥈");
    expect(getMilestoneBadge(13)).toBe("🥈");
  });

  it("returns gold for streak 14-29", () => {
    expect(getMilestoneBadge(14)).toBe("🥇");
    expect(getMilestoneBadge(29)).toBe("🥇");
  });

  it("returns diamond for streak 30+", () => {
    expect(getMilestoneBadge(30)).toBe("💎");
    expect(getMilestoneBadge(100)).toBe("💎");
  });
});

describe("getMilestoneLabel", () => {
  it("returns empty string for streak below 3", () => {
    expect(getMilestoneLabel(0)).toBe("");
    expect(getMilestoneLabel(2)).toBe("");
  });

  it("returns 'Bronze tier' for 3-6", () => {
    expect(getMilestoneLabel(3)).toBe("Bronze tier");
    expect(getMilestoneLabel(5)).toBe("Bronze tier");
  });

  it("returns 'Silver tier' for 7-13", () => {
    expect(getMilestoneLabel(7)).toBe("Silver tier");
    expect(getMilestoneLabel(10)).toBe("Silver tier");
  });

  it("returns 'Gold tier' for 14-29", () => {
    expect(getMilestoneLabel(14)).toBe("Gold tier");
    expect(getMilestoneLabel(25)).toBe("Gold tier");
  });

  it("returns 'Diamond tier' for 30+", () => {
    expect(getMilestoneLabel(30)).toBe("Diamond tier");
    expect(getMilestoneLabel(365)).toBe("Diamond tier");
  });
});
