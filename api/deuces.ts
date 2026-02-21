import { api } from "./index";
import type { Deuce, Reaction } from "../types/api.types";

/** Fetch the global deuce feed */
export async function getGlobalFeed(): Promise<Deuce[]> {
  const { data } = await api.get<Deuce[]>("/api/deuces");
  return data;
}

/** Fetch the full deuce feed for a group */
export async function getFeed(groupId: string): Promise<Deuce[]> {
  const { data } = await api.get<{ group: any; members: any[]; entries: Deuce[] }>(
    `/api/groups/${groupId}`
  );
  return data.entries;
}

/** Log a new deuce */
export async function postDeuce(payload: {
  groupIds: string[];
  location: string;
  thoughts: string;
  loggedAt?: string;
}): Promise<{ entries: Deuce[]; count: number }> {
  const { data } = await api.post("/api/deuces", payload);
  return data;
}

/** Add a reaction to an entry */
export async function addReaction(
  entryId: string,
  emoji: string
): Promise<Reaction> {
  const { data } = await api.post<Reaction>(
    `/api/entries/${entryId}/reactions`,
    { emoji }
  );
  return data;
}

/** Remove a reaction from an entry */
export async function removeReaction(
  entryId: string,
  emoji: string
): Promise<void> {
  await api.delete(`/api/entries/${entryId}/reactions`, { data: { emoji } });
}

/** Get all reactions for an entry */
export async function getReactions(entryId: string): Promise<Reaction[]> {
  const { data } = await api.get<Reaction[]>(
    `/api/entries/${entryId}/reactions`
  );
  return data;
}

/** Fetch deuces feed filtered by group */
export async function getGroupFeed(groupId: string): Promise<Deuce[]> {
  const { data } = await api.get<Deuce[]>("/api/deuces", {
    params: { groupId },
  });
  return data;
}
