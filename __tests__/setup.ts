// Suppress console.warn/error noise during tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("[RevenueCat]") ||
        args[0].includes("[Notifications]"))
    ) {
      return;
    }
    originalWarn(...args);
  };
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("not wrapped in act")
    ) {
      return;
    }
    originalError(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});
