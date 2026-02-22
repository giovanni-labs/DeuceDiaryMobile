import { useEffect } from "react";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { api } from "../api/index";

const STREAK_REMINDER_ID = "streak-reminder";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ── Permissions ──────────────────────────────────────────────────────
async function requestPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

// ── Push token registration ──────────────────────────────────────────
async function registerPushToken() {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await api.post("/api/notifications/register", {
      token,
      platform: Platform.OS,
    });
  } catch (err) {
    console.warn("[Notifications] push token registration failed:", err);
  }
}

// ── Streak reminder scheduling ───────────────────────────────────────

async function scheduleStreakReminder() {
  // Cancel existing reminder before re-scheduling
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID).catch(
    () => {},
  );

  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_REMINDER_ID,
    content: {
      title: "\uD83D\uDEBD Don't break your streak!",
      body: "You haven't dropped a deuce today. Don't let the squad down.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

/**
 * Cancel today's streak reminder — call this after a successful deuce log.
 * The next app launch will re-schedule for the following day.
 */
export async function cancelStreakReminder() {
  await Notifications.cancelScheduledNotificationAsync(STREAK_REMINDER_ID).catch(
    () => {},
  );
}

// ── Hook ─────────────────────────────────────────────────────────────

export function useNotifications() {
  useEffect(() => {
    async function init() {
      const granted = await requestPermissions();
      if (!granted) return;

      await registerPushToken();
      await scheduleStreakReminder();
    }
    init();
  }, []);
}
