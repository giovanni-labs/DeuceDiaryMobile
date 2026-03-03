export const SchedulableTriggerInputTypes = {
  DAILY: "DAILY",
  DATE: "DATE",
} as const;

export function setNotificationHandler() {}

export function getPermissionsAsync() {
  return Promise.resolve({ status: "granted" });
}

export function requestPermissionsAsync() {
  return Promise.resolve({ status: "granted" });
}

export function getExpoPushTokenAsync() {
  return Promise.resolve({ data: "ExponentPushToken[test-token]" });
}

export function scheduleNotificationAsync() {
  return Promise.resolve("notification-id");
}

export function cancelScheduledNotificationAsync() {
  return Promise.resolve();
}

export function setBadgeCountAsync() {
  return Promise.resolve();
}

const listeners: Array<(notification: any) => void> = [];

export function addNotificationReceivedListener(
  callback: (notification: any) => void
) {
  listeners.push(callback);
  return {
    remove: () => {
      const idx = listeners.indexOf(callback);
      if (idx >= 0) listeners.splice(idx, 1);
    },
  };
}

// Test helper
export function __simulateNotification(notification: any) {
  listeners.forEach((cb) => cb(notification));
}
