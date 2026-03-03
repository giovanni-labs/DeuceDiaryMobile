module.exports = {
  preset: "jest-expo",
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/__tests__/setup\\.ts$",
  ],
  transformIgnorePatterns: [
    "/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|react-native-purchases|@tanstack/react-query))",
    "/node_modules/react-native-reanimated/plugin/",
  ],
  moduleNameMapper: {
    "^@react-native-async-storage/async-storage$":
      "<rootDir>/__mocks__/@react-native-async-storage/async-storage.ts",
    "^@react-native-community/netinfo$":
      "<rootDir>/__mocks__/@react-native-community/netinfo.ts",
    "^react-native-purchases$":
      "<rootDir>/__mocks__/react-native-purchases.ts",
    "^expo-linking$": "<rootDir>/__mocks__/expo-linking.ts",
    "^expo-notifications$": "<rootDir>/__mocks__/expo-notifications.ts",
    "^expo-router$": "<rootDir>/__mocks__/expo-router.ts",
    "^expo-status-bar$": "<rootDir>/__mocks__/expo-status-bar.ts",
    "^expo-secure-store$": "<rootDir>/__mocks__/expo-secure-store.ts",
  },
};
