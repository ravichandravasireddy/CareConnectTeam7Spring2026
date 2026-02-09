// =============================================================================
// SHARED TEST MOCKS
// =============================================================================

export const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  href: "",
};

export function setupExpoRouterMock() {
  jest.mock("expo-router", () => ({
    useRouter: () => mockRouter,
    useLocalSearchParams: () => ({}),
  }));
}

export function setupReactNativeMock() {
  jest.mock("react-native", () => {
    const RN = jest.requireActual("react-native");
    return {
      ...RN,
      useColorScheme: jest.fn(() => "light"),
    };
  });
}
