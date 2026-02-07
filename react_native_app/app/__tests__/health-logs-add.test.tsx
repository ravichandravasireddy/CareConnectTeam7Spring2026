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
    TextInput: (p: unknown) => R.createElement("TextInput", p),
    KeyboardAvoidingView: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

const mockBack = jest.fn();
const mockUseLocalSearchParams = jest.fn(() => ({ initialType: "general" }));
jest.mock("expo-router", () => ({
  Stack: { Screen: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children) },
  useRouter: () => ({ back: mockBack }),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock("react-native-safe-area-context", () => {
  const R = require("react");
  const { View } = require("react-native");
  return { SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => R.createElement(View, { testID: "safe-area-view", ...p }, children) };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const R = require("react");
  const { View } = require("react-native");
  return () => R.createElement(View, { testID: "icon-close" });
});

jest.mock("@/hooks/use-color-scheme", () => ({ useColorScheme: jest.fn(() => "light") }));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockAddLog = jest.fn();
const mockWaterTotalForDate = jest.fn(() => 0);
jest.mock("../../providers/HealthLogProvider", () => ({
  useHealthLogProvider: () => ({ addLog: mockAddLog, waterTotalForDate: mockWaterTotalForDate }),
  DEFAULT_WATER_GOAL_OZ: 64,
}));

import HealthLogAddScreen from "../health-logs/add";

describe("HealthLogAddScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ initialType: "general" });
  });

  it("renders Save Log and Log Type", () => {
    render(<HealthLogAddScreen />);
    expect(screen.getByText("Save Log")).toBeTruthy();
    expect(screen.getByText("Log Type")).toBeTruthy();
  });

  it("saves general log and goes back", () => {
    render(<HealthLogAddScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Add a general note"), "Test description");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({ type: HealthLogType.general, description: "Test description" });
    expect(mockBack).toHaveBeenCalled();
  });

  it("shows validation error when general description empty", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getByText("Enter a description")).toBeTruthy();
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("uses initialType from params and shows mood form when mood", () => {
    mockUseLocalSearchParams.mockReturnValue({ initialType: "mood" });
    render(<HealthLogAddScreen />);
    expect(screen.getByText(/Happy/)).toBeTruthy();
    expect(screen.getByPlaceholderText("Add details about your mood")).toBeTruthy();
  });

  it("saves mood log and goes back", () => {
    mockUseLocalSearchParams.mockReturnValue({ initialType: "mood" });
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({ type: HealthLogType.mood, description: "Happy", emoji: "😊" });
    expect(mockBack).toHaveBeenCalled();
  });

  it("switches to water type and shows water form", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Water"));
    expect(screen.getByPlaceholderText("e.g. 12 or -8")).toBeTruthy();
    expect(screen.getByText(/Current total:/)).toBeTruthy();
  });

  it("shows validation error for water when amount empty", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Water"));
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getByText("Enter an amount")).toBeTruthy();
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("shows validation error for water when amount not a number", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Water"));
    fireEvent.changeText(screen.getByPlaceholderText("e.g. 12 or -8"), "abc");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getByText("Enter a number")).toBeTruthy();
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("saves water log and calls waterTotalForDate", () => {
    mockWaterTotalForDate.mockReturnValue(24);
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Water"));
    fireEvent.changeText(screen.getByPlaceholderText("e.g. 12 or -8"), "12");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockWaterTotalForDate).toHaveBeenCalled();
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({
      type: HealthLogType.water,
      waterTotal: 36,
      waterDelta: 12,
      waterGoal: 64,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it("switches to blood pressure and shows systolic/diastolic inputs", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Blood Pressure"));
    expect(screen.getByText("Systolic (upper)")).toBeTruthy();
    expect(screen.getByText("Diastolic (lower)")).toBeTruthy();
    expect(screen.getByPlaceholderText("120")).toBeTruthy();
    expect(screen.getByPlaceholderText("80")).toBeTruthy();
  });

  it("shows validation errors for blood pressure when empty", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Blood Pressure"));
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getAllByText("Required").length).toBeGreaterThanOrEqual(1);
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("saves blood pressure log", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Blood Pressure"));
    fireEvent.changeText(screen.getByPlaceholderText("120"), "130");
    fireEvent.changeText(screen.getByPlaceholderText("80"), "85");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({
      type: HealthLogType.bloodPressure,
      description: "Blood Pressure: 130/85 mmHg",
      systolic: 130,
      diastolic: 85,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it("switches to heart rate and shows bpm input", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Heart Rate"));
    expect(screen.getByText("Heart rate (bpm)")).toBeTruthy();
    expect(screen.getByPlaceholderText("72")).toBeTruthy();
  });

  it("shows validation error for heart rate when empty", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Heart Rate"));
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getByText("Enter bpm")).toBeTruthy();
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("saves heart rate log", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Heart Rate"));
    fireEvent.changeText(screen.getByPlaceholderText("72"), "68");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({
      type: HealthLogType.heartRate,
      description: "Heart Rate: 68 bpm",
      heartRateBpm: 68,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it("switches to sleep and shows duration slider and buttons", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Sleep"));
    expect(screen.getByText(/Sleep duration: 7.0 hours/)).toBeTruthy();
    expect(screen.getByText("7h")).toBeTruthy();
    expect(screen.getByPlaceholderText("How did you sleep?")).toBeTruthy();
  });

  it("saves sleep log with selected hours", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Sleep"));
    fireEvent.press(screen.getByText("8h"));
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({
      type: HealthLogType.sleep,
      description: "Slept 8.0 hours",
      sleepHours: 8,
    });
    expect(mockBack).toHaveBeenCalled();
  });

  it("switches to symptoms and shows description with hint", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Symptoms"));
    expect(screen.getByPlaceholderText("What symptoms did you notice?")).toBeTruthy();
  });

  it("shows validation error for symptoms when description empty", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Symptoms"));
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(screen.getByText("Enter a description")).toBeTruthy();
    expect(mockAddLog).not.toHaveBeenCalled();
  });

  it("saves symptoms log with description", () => {
    render(<HealthLogAddScreen />);
    fireEvent.press(screen.getByText("Symptoms"));
    fireEvent.changeText(screen.getByPlaceholderText("What symptoms did you notice?"), "Headache");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog).toHaveBeenCalledTimes(1);
    expect(mockAddLog.mock.calls[0][0]).toMatchObject({ type: HealthLogType.symptoms, description: "Headache" });
    expect(mockBack).toHaveBeenCalled();
  });

  it("invalid initialType falls back to general", () => {
    mockUseLocalSearchParams.mockReturnValue({ initialType: "invalid" });
    render(<HealthLogAddScreen />);
    expect(screen.getByPlaceholderText("Add a general note")).toBeTruthy();
  });

  it("optional note is included when provided", () => {
    render(<HealthLogAddScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("Add a general note"), "Desc");
    fireEvent.changeText(screen.getByPlaceholderText("Add a note"), "Optional note");
    fireEvent.press(screen.getByLabelText("Save Log, button"));
    expect(mockAddLog.mock.calls[0][0].note).toBe("Optional note");
  });
});
