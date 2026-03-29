module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/_AI/",
    "/.maestro/",
  ],
  setupFiles: ['<rootDir>/jest.setup.early.js'],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  collectCoverage: false,
  collectCoverageFrom: [
    "**/*.{js,jsx,ts,tsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    '!**/__tests__/**',
    '!**/*.test.{js,jsx,ts,tsx}',
    "!**/babel.config.js",
    "!**/jest.setup.js",
    "!eslint.config.js",
    "!expo-env.d.ts",
    "!jest.config.js",
    "!.expo/**",
    "!scripts/**",
    "!**/_AI/**",
    "!**/.maestro/**",
    "!**/models/TimelineEvent.ts",
    "!**/screens/test-setup.ts",

  ],
  // Primary gate: lines, statements, functions ≥ 90%. Branches stay lower (~87%):
  // Istanbul counts both arms of `pressed && styles` on Pressables heavily in RN.
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 87,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};
