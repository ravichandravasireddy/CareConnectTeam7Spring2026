/**
 * Detox E2E Configuration
 * Assignment 6: "E2E tests - Full user journeys - Detox (React Native)"
 *
 * Prerequisites:
 * - Run `npx expo prebuild` to generate native android/ios folders
 * - Build app: `detox build --configuration ios.sim.debug` or `android.emu.debug`
 * - Run: `detox test --configuration ios.sim.debug`
 */
/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: "jest",
      config: "jest.e2e.config.js",
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    "ios.debug": {
      type: "ios.app",
      binaryPath: "ios/build/Build/Products/Debug-iphonesimulator/CareConnect.app",
    },
    "android.debug": {
      type: "android.apk",
      binaryPath: "android/app/build/outputs/apk/debug/app-debug.apk",
    },
  },
  devices: {
    simulator: {
      type: "ios.simulator",
      device: { type: "iPhone 15", os: "iOS 17.0" },
    },
    emulator: {
      type: "android.emulator",
      device: { avdName: "Pixel_4_API_30" },
    },
  },
  configurations: {
    "ios.sim.debug": {
      device: "simulator",
      app: "ios.debug",
    },
    "android.emu.debug": {
      device: "emulator",
      app: "android.debug",
    },
  },
};
