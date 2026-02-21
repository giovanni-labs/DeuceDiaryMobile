export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  profileImageUrl: string | null;
  deuceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Squad {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  entryCount?: number;
  lastActivity?: string | null;
}

export interface Deuce {
  id: string;
  userId: string;
  groupId: string;
  location: string;
  thoughts: string;
  loggedAt: string;
  createdAt: string;
  user?: User;
}

export interface Reaction {
  id: number;
  entryId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  user?: User;
}

export interface SquadMember {
  id: number;
  groupId: string;
  userId: string;
  role: "admin" | "member";
  joinedAt: string;
  user: User;
  personalRecord: { date: string; count: number } | null;
}

export interface SquadDetail {
  group: Squad;
  members: SquadMember[];
  entries: Deuce[];
}

export interface Location {
  id: number;
  name: string;
  isDefault: boolean;
  createdBy: string | null;
  createdAt: string;
}

export interface StreakMemberLog {
  userId: string;
  username: string;
  hasLogged: boolean;
  profileImageUrl: string | null;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  memberCount: number;
  logsToday: StreakMemberLog[];
}

export interface InviteLink {
  inviteLink: string;
  id: string;
}

export interface GroupPreview {
  name: string;
  memberCount: number;
  description: string | null;
}
