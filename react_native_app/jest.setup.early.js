// MUST run before any module loads react-native. Avoids TurboModuleRegistry/DevMenu error.
// Mock TurboModuleRegistry.getEnforcing to return mocks for native modules (DevMenu, etc.).
jest.mock("react-native/Libraries/TurboModule/TurboModuleRegistry", () => {
  const mockModule = () => ({
    show: jest.fn(),
    reload: jest.fn(),
    setProfilingEnabled: jest.fn(),
    setHotLoadingEnabled: jest.fn(),
  });
  return {
    get: jest.fn(() => null),
    getEnforcing: jest.fn(() => mockModule()),
  };
});
