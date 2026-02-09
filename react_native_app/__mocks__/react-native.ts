// =============================================================================
// GLOBAL REACT-NATIVE MOCK
// =============================================================================
// Avoids TurboModuleRegistry/DevMenu errors in Jest. Use this instead of
// requireActual("react-native") which loads native modules.
// =============================================================================

const React = require("react");

const createMockComponent = (name: string) => {
  const MockComponent = (props: unknown) => React.createElement(name, props);
  MockComponent.displayName = name;
  return MockComponent;
};

module.exports = {
  View: createMockComponent("View"),
  Text: createMockComponent("Text"),
  TextInput: createMockComponent("TextInput"),
  ScrollView: createMockComponent("ScrollView"),
  Pressable: createMockComponent("Pressable"),
  FlatList: createMockComponent("FlatList"),
  TouchableOpacity: createMockComponent("TouchableOpacity"),
  Switch: createMockComponent("Switch"),
  ActivityIndicator: createMockComponent("ActivityIndicator"),
  Modal: createMockComponent("Modal"),
  Alert: { alert: jest.fn() },
  AccessibilityInfo: {
    announceForAccessibility: jest.fn(),
  },
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
    flatten: (style: unknown) => style,
    absoluteFill: {},
    absoluteFillObject: {},
  },
  useColorScheme: jest.fn(() => "light"),
  useWindowDimensions: jest.fn(() => ({
    width: 375,
    height: 812,
    scale: 2,
    fontScale: 1,
  })),
  Platform: {
    OS: "ios",
    select: (opts: Record<string, unknown>) => opts?.default ?? opts?.ios,
  },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
};
