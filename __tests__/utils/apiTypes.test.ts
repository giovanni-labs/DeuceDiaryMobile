// Compile-time type validation tests — ensure API types are correctly defined
import type {
  User,
  Squad,
  Deuce,
  Reaction,
  SquadMember,
  SquadDetail,
  StreakData,
  StreakMemberLog,
  InviteLink,
  GroupPreview,
  LeaderboardEntry,
} from "../../types/api.types";

describe("API Types", () => {
  it("User type has required fields", () => {
    const user: User = {
      id: "1",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      username: "testuser",
      profileImageUrl: null,
      deuceCount: 0,
      subscription: "free",
      theme: "default",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    };
    expect(user.id).toBeDefined();
    expect(user.subscription).toMatch(/^(free|premium)$/);
  });

  it("Squad type has required fields", () => {
    const squad: Squad = {
      id: "s1",
      name: "Test Squad",
      description: null,
      createdBy: "u1",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    };
    expect(squad.id).toBeDefined();
    expect(squad.name).toBeTruthy();
  });

  it("Deuce type has required fields", () => {
    const deuce: Deuce = {
      id: "d1",
      userId: "u1",
      groupId: "g1",
      location: "Home",
      thoughts: "Test",
      loggedAt: "2026-01-01T00:00:00Z",
      createdAt: "2026-01-01T00:00:00Z",
    };
    expect(deuce.id).toBeDefined();
  });

  it("StreakData type has required fields", () => {
    const streak: StreakData = {
      currentStreak: 5,
      longestStreak: 10,
      memberCount: 3,
      logsToday: [
        { userId: "u1", username: "test", hasLogged: true, profileImageUrl: null },
      ],
    };
    expect(streak.currentStreak).toBeGreaterThanOrEqual(0);
    expect(streak.logsToday).toHaveLength(1);
  });

  it("GroupPreview type has required fields", () => {
    const preview: GroupPreview = {
      name: "Test",
      memberCount: 5,
      description: null,
    };
    expect(preview.name).toBeTruthy();
    expect(preview.memberCount).toBeGreaterThan(0);
  });

  it("LeaderboardEntry type has required fields", () => {
    const entry: LeaderboardEntry = {
      userId: "u1",
      username: "leader",
      profileImageUrl: null,
      deuceCount: 42,
    };
    expect(entry.deuceCount).toBeGreaterThanOrEqual(0);
  });

  it("SquadDetail composes Squad, SquadMember, and Deuce", () => {
    const detail: SquadDetail = {
      group: {
        id: "s1",
        name: "Test",
        description: null,
        createdBy: "u1",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
      members: [],
      entries: [],
    };
    expect(detail.group.id).toBeDefined();
    expect(Array.isArray(detail.members)).toBe(true);
    expect(Array.isArray(detail.entries)).toBe(true);
  });

  it("InviteLink has inviteLink and id", () => {
    const invite: InviteLink = {
      inviteLink: "https://deucediary.app/invite/abc",
      id: "inv1",
    };
    expect(invite.inviteLink).toContain("invite");
    expect(invite.id).toBeTruthy();
  });
});
