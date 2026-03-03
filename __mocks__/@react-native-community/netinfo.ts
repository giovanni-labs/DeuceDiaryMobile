const listeners: Array<(state: any) => void> = [];

const NetInfo = {
  addEventListener: jest.fn((callback: (state: any) => void) => {
    listeners.push(callback);
    // Immediately call with connected state
    callback({ isConnected: true, isInternetReachable: true });
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }),
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true })
  ),
  // Test helper to simulate connectivity changes
  __simulateChange: (state: { isConnected: boolean }) => {
    listeners.forEach((cb) => cb(state));
  },
};

export default NetInfo;
