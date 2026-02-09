// =============================================================================
// TASK CARD COMPONENT TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { TaskCard } from "../task-card";
import type { Task } from "@/models/task";

jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    TouchableOpacity: (props: unknown) => React.createElement("TouchableOpacity", props),
    StyleSheet: {
      create: (s: Record<string, unknown>) => s,
      flatten: (x: unknown) => x,
    },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (opts: Record<string, unknown>) => opts?.ios ?? opts?.default },
  };
});

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  function MockMaterialIcons(props: { name: string }) {
    return React.createElement(View, { testID: `icon-${props.name}` });
  }
  MockMaterialIcons.displayName = "MaterialIcons";
  return MockMaterialIcons;
});

jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => {
  // require() needed in Jest mock factory (hoisted scope; import not available)
  const React = require("react"); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require("react-native"); // eslint-disable-line @typescript-eslint/no-require-imports
  function MockMaterialCommunityIcons(props: { name: string }) {
    return React.createElement(View, { testID: `mci-${props.name}` });
  }
  MockMaterialCommunityIcons.displayName = "MaterialCommunityIcons";
  return MockMaterialCommunityIcons;
});

const mockTask: Task = {
  id: "1",
  title: "Morning Medication",
  description: "Take with water",
  date: new Date(2026, 1, 5, 9, 0),
  patientName: "Robert Williams",
  icon: "medication",
  iconBackground: "#E3F2FD",
  iconColor: "#1976D2",
};

describe("TaskCard", () => {
  beforeEach(() => {
    (RN.useColorScheme as jest.Mock).mockReturnValue("light");
  });

  it("renders task title", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("Morning Medication")).toBeTruthy();
  });

  it("renders time when showTime is true (default)", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText("9:00 AM")).toBeTruthy();
  });

  it("does not render time when showTime is false", () => {
    render(<TaskCard task={mockTask} showTime={false} />);
    expect(screen.getByText("Morning Medication")).toBeTruthy();
    expect(screen.queryByText("9:00 AM")).toBeNull();
  });

  it("renders patient name when showPatientName is true", () => {
    render(<TaskCard task={mockTask} showPatientName={true} />);
    expect(screen.getByText("Robert Williams")).toBeTruthy();
  });

  it("does not render patient name when showPatientName is false", () => {
    render(<TaskCard task={mockTask} showPatientName={false} />);
    expect(screen.queryByText("Robert Williams")).toBeNull();
  });

  it("calls onPress when TouchableOpacity is pressed", () => {
    const onPress = jest.fn();
    render(<TaskCard task={mockTask} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText(/Morning Medication/));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has accessibility label with title and time when showTime true", () => {
    render(<TaskCard task={mockTask} />);
    const el = screen.getByLabelText("Morning Medication, 9:00 AM");
    expect(el).toBeTruthy();
  });

  it("has accessibility role button when onPress provided", () => {
    render(<TaskCard task={mockTask} onPress={() => {}} />);
    const btn = screen.getByRole("button", { name: /Morning Medication/ });
    expect(btn).toBeTruthy();
  });

  it("has accessibility hint for task details when onPress provided", () => {
    render(<TaskCard task={mockTask} onPress={() => {}} />);
    const el = screen.getByLabelText(/Morning Medication/);
    expect(el.props.accessibilityHint).toBe("Double tap to view task details");
  });

  it("renders icon", () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByTestId("icon-medication")).toBeTruthy();
  });
});
