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

jest.mock("@/providers/UserProvider", () => ({
  useUser: () => ({
    userRole: "patient" as const,
    isPatient: true,
    userName: null,
    userEmail: null,
    setUserRole: jest.fn(),
    setUserInfo: jest.fn(),
  }),
  UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock("@/components/app-app-bar", () => {
  const R = require("react");
  const { View, Text } = require("react-native");
  return {
    AppAppBar: ({ title }: { title?: string }) =>
      R.createElement(View, { testID: "app-app-bar" }, title != null ? R.createElement(Text, {}, title) : null),
  };
});

jest.mock("@/components/app-bottom-nav-bar", () => {
  const R = require("react");
  const { View } = require("react-native");
  return {
    AppBottomNavBar: () => R.createElement(View, { testID: "app-bottom-nav-bar" }),
    kPatientNavHealth: 3,
    kCaregiverNavHome: 0,
  };
});

const mockTypeColors = jest.fn(() => ({ bg: "#eee", fg: "#333" }));
let mockLatestByType: Partial<
  Record<import("@/models/HealthLog").HealthLogType, import("@/models/HealthLog").HealthLog>
> = {};
jest.mock("../../providers/HealthLogProvider", () => ({
  useHealthLogProvider: () => ({
    logs: [],
    latestByType: mockLatestByType,
    typeColors: mockTypeColors,
  }),
}));

import HealthLogsScreen from "../health-logs/index";

describe("HealthLogsScreen", () => {
  beforeEach(() => {
    mockLatestByType = {};
  });

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

  it("shows blood pressure category chip for latest BP log", () => {
    mockLatestByType = {
      [HealthLogType.bloodPressure]: {
        id: "bp1",
        type: HealthLogType.bloodPressure,
        description: "Morning reading",
        note: null,
        createdAt: new Date(2026, 2, 28, 8, 30),
        systolic: 118,
        diastolic: 76,
      },
    };
    render(<HealthLogsScreen />);
    expect(screen.getByText("Normal")).toBeTruthy();
  });

  it("shows heart rate category chip for latest HR log", () => {
    mockLatestByType = {
      [HealthLogType.heartRate]: {
        id: "hr1",
        type: HealthLogType.heartRate,
        description: "Resting",
        createdAt: new Date(2026, 2, 28, 8, 0),
        heartRateBpm: 72,
      },
    };
    render(<HealthLogsScreen />);
    expect(screen.getByText("Normal")).toBeTruthy();
  });

  it("shows note and water progress when latest water log has goal", () => {
    mockLatestByType = {
      [HealthLogType.water]: {
        id: "w1",
        type: HealthLogType.water,
        description: "Intake",
        note: "Feeling good",
        createdAt: new Date(2026, 2, 28, 7, 0),
        waterTotal: 48,
        waterGoal: 64,
      },
    };
    render(<HealthLogsScreen />);
    expect(screen.getByText(/Feeling good/)).toBeTruthy();
    expect(screen.getByText(/Goal: 64 oz/)).toBeTruthy();
  });
});
