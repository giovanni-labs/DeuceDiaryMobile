export const LOG_LEVEL = { DEBUG: "DEBUG" } as const;

const Purchases = {
  configure: jest.fn(),
  setLogLevel: jest.fn(),
  getCustomerInfo: jest.fn(() =>
    Promise.resolve({ entitlements: { active: {} } })
  ),
  purchaseProduct: jest.fn(() =>
    Promise.resolve({ customerInfo: { entitlements: { active: {} } } })
  ),
  restorePurchases: jest.fn(() =>
    Promise.resolve({ entitlements: { active: {} } })
  ),
};

export default Purchases;
