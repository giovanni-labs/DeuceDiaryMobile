import { api } from "./index";
import type { Squad, SquadDetail, StreakData, InviteLink, GroupPreview } from "../types/api.types";

/** List all squads the user belongs to */
export async function listSquads(): Promise<Squad[]> {
  const { data } = await api.get<Squad[]>("/api/groups");
  return data;
}

/** Join a squad via invite */
export async function joinSquad(
  inviteId: string
): Promise<{ group: Squad; message?: string }> {
  const { data } = await api.post(`/api/join/${inviteId}`);
  return data;
}

/** Create a new squad */
export async function createSquad(payload: {
  name: string;
  description?: string;
}): Promise<Squad> {
  const { data } = await api.post<Squad>("/api/groups", payload);
  return data;
}

/** Get full squad detail */
export async function getSquadDetail(squadId: string): Promise<SquadDetail> {
  const { data } = await api.get<SquadDetail>(`/api/groups/${squadId}`);
  return data;
}

/** Fetch group streak data */
export async function getGroupStreak(groupId: string): Promise<StreakData> {
  const { data } = await api.get<StreakData>(`/api/groups/${groupId}/streak`);
  return data;
}

/** Create invite link for a group */
export async function createInvite(groupId: string): Promise<InviteLink> {
  const { data } = await api.post<InviteLink>(`/api/groups/${groupId}/invite`);
  return data;
}

/** Get group preview by invite code (no auth required) */
export async function getGroupPreview(code: string): Promise<GroupPreview> {
  const { data } = await api.get<GroupPreview>(`/api/groups/preview/${code}`);
  return data;
}
