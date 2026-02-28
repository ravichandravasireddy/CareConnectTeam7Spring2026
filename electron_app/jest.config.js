/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'index.js',
    'preload.js',
    'renderer/app.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 75,
      lines: 90,
      statements: 89,
    },
  },
  coverageReporters: ['text', 'text-summary', 'html'],
  setupFilesAfterEnv: [],
  testTimeout: 5000,
};
