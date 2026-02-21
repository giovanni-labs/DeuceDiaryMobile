import Purchases, { type CustomerInfo } from "react-native-purchases";
import { api } from "../api";

/**
 * Configure RevenueCat SDK. Call once at app startup when a real key is present.
 */
export function configure(apiKey: string): void {
  Purchases.configure({ apiKey });
}

/**
 * Fetch current customer subscription status from RevenueCat.
 */
export async function getCustomerInfo(): Promise<{
  isPremium: boolean;
  activeEntitlements: string[];
  expirationDate: string | null;
}> {
  const info: CustomerInfo = await Purchases.getCustomerInfo();
  const activeEntitlements = Object.keys(info.entitlements.active);

  // Find the latest expiration across all active entitlements
  let expirationDate: string | null = null;
  for (const key of activeEntitlements) {
    const ent = info.entitlements.active[key];
    if (ent.expirationDate && (!expirationDate || ent.expirationDate > expirationDate)) {
      expirationDate = ent.expirationDate;
    }
  }

  return {
    isPremium: activeEntitlements.length > 0,
    activeEntitlements,
    expirationDate,
  };
}

/**
 * After a successful purchase, notify the backend so it can update
 * the user's subscription status in the database.
 */
export async function syncWithBackend(userId?: string): Promise<void> {
  await api.post("/api/subscription/upgrade", userId ? { userId } : undefined);
}
