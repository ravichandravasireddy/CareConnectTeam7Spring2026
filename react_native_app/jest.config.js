module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)",
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
    "!hooks/use-theme-color.ts", // DELETE ME AT MERGE
    "!hooks/use-color-scheme.web.ts", // DELETE ME AT MERGE
    "!app/modal.tsx", // DELETE ME AT MERGE
    "!components/ui/**",// DELETE ME AT MERGE
    "!components/haptic-tab.tsx",// DELETE ME AT MERGE
    "!components/themed-*.tsx",// DELETE ME AT MERGE
    "!components/parallax-scroll-view.tsx",// DELETE ME AT MERGE
    "!components/external-link.tsx",// DELETE ME AT MERGE
    "!components/hello-wave.tsx",// DELETE ME AT MERGE


  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};
