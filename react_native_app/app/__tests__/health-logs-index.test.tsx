import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { HealthLogType } from "@/models/HealthLog";

jest.mock("react-native", () => {
  const R = require("react");
  return {
    View: (p: unknown) => R.createElement("View", p),
    Text: (p: unknown) => R.createElement("Text", p),
    ScrollView: (p: unknown) => R.createElement("ScrollView", p),
    TouchableOpacity: (p: unknown) => R.createElement("TouchableOpacity", p),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  Stack: { Screen: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children) },
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("react-native-safe-area-context", () => {
  const R = require("react");
  const { View } = require("react-native");
  return { SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => R.createElement(View, { testID: "safe-area-view", ...p }, children) };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const R = require("react");
  const { View } = require("react-native");
  return ({ name }: { name: string }) => R.createElement(View, { testID: `icon-${name}` });
});

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockTypeColors = jest.fn(() => ({ bg: "#eee", fg: "#333" }));
jest.mock("../../providers/HealthLogProvider", () => ({
  useHealthLogProvider: () => ({
    logs: [],
    latestByType: {},
    typeColors: mockTypeColors,
  }),
}));

import HealthLogsScreen from "../health-logs/index";

describe("HealthLogsScreen", () => {
  it("renders Add a Log and Quick Log", () => {
    render(<HealthLogsScreen />);
    expect(screen.getByText("Add a Log")).toBeTruthy();
    expect(screen.getByText("Quick Log")).toBeTruthy();
  });

  it("renders Latest by type", () => {
    render(<HealthLogsScreen />);
    expect(screen.getByText("Latest by type")).toBeTruthy();
  });

  it("navigates to add when Add a Log pressed", () => {
    render(<HealthLogsScreen />);
    fireEvent.press(screen.getByLabelText("Add a Log, button"));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/health-logs/add", params: { initialType: HealthLogType.general } });
  });

  it("navigates to add with mood when Mood quick log pressed", () => {
    render(<HealthLogsScreen />);
    fireEvent.press(screen.getByLabelText("Mood quick log, button"));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/health-logs/add", params: { initialType: HealthLogType.mood } });
  });

  it("renders LatestLogCard without log when no log exists", () => {
    render(<HealthLogsScreen />);
    // Should show "No Mood logged" or similar for types without logs
    const noLogTexts = screen.queryAllByText(/No .* logged/);
    expect(noLogTexts.length).toBeGreaterThan(0);
  });
});
