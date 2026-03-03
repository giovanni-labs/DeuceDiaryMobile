const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  canGoBack: jest.fn(() => true),
};

export function useRouter() {
  return mockRouter;
}

export function useSegments() {
  return [];
}

export function useLocalSearchParams() {
  return {};
}

export function Stack() {
  return null;
}
Stack.Screen = () => null;

export function Tabs() {
  return null;
}
Tabs.Screen = () => null;

// Test helper to access mock router
export const __mockRouter = mockRouter;
