// Test the relativeTime utility used in HomeScreen and SquadDetailScreen
// We recreate the function here since it's not exported

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

describe("relativeTime", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-03T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 'just now' for times less than 60 seconds ago", () => {
    expect(relativeTime("2026-03-03T11:59:30Z")).toBe("just now");
    expect(relativeTime("2026-03-03T11:59:01Z")).toBe("just now");
  });

  it("returns minutes ago for times between 1-59 minutes", () => {
    expect(relativeTime("2026-03-03T11:55:00Z")).toBe("5 min ago");
    expect(relativeTime("2026-03-03T11:30:00Z")).toBe("30 min ago");
    expect(relativeTime("2026-03-03T11:01:00Z")).toBe("59 min ago");
  });

  it("returns hours ago for times between 1-23 hours", () => {
    expect(relativeTime("2026-03-03T10:00:00Z")).toBe("2h ago");
    expect(relativeTime("2026-03-02T13:00:00Z")).toBe("23h ago");
  });

  it("returns days ago for times between 1-6 days", () => {
    expect(relativeTime("2026-03-02T12:00:00Z")).toBe("1d ago");
    expect(relativeTime("2026-02-28T12:00:00Z")).toBe("3d ago");
    expect(relativeTime("2026-02-25T12:00:00Z")).toBe("6d ago");
  });

  it("returns formatted date for times more than 7 days ago", () => {
    const result = relativeTime("2026-02-20T12:00:00Z");
    // Should contain month and day
    expect(result).toMatch(/Feb/);
    expect(result).toMatch(/20/);
  });

  it("handles future times gracefully (returns just now)", () => {
    // Math.max(0, ...) clamps negative diffs to 0
    expect(relativeTime("2026-03-03T13:00:00Z")).toBe("just now");
  });

  it("handles exact boundary at 60 seconds", () => {
    expect(relativeTime("2026-03-03T11:59:00Z")).toBe("1 min ago");
  });
});

// Also test the squads relativeTime variant
function squadsRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "No activity yet";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "last deuce just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `last deuce ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `last deuce ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `last deuce ${days}d ago`;
}

describe("squadsRelativeTime", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-03-03T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 'No activity yet' for null", () => {
    expect(squadsRelativeTime(null)).toBe("No activity yet");
  });

  it("returns 'No activity yet' for undefined", () => {
    expect(squadsRelativeTime(undefined)).toBe("No activity yet");
  });

  it("returns prefixed time for valid dates", () => {
    expect(squadsRelativeTime("2026-03-03T11:59:30Z")).toBe("last deuce just now");
    expect(squadsRelativeTime("2026-03-03T11:50:00Z")).toBe("last deuce 10 min ago");
    expect(squadsRelativeTime("2026-03-03T09:00:00Z")).toBe("last deuce 3h ago");
    expect(squadsRelativeTime("2026-03-01T12:00:00Z")).toBe("last deuce 2d ago");
  });
});
