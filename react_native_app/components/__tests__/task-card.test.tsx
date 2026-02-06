// =============================================================================
// TASK CARD COMPONENT TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { TaskCard } from "../task-card";
import type { Task } from "@/models/Task";

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

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return ({ name }: { name: string }) =>
    React.createElement(View, { testID: `icon-${name}` });
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
