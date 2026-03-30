// =============================================================================
// TASK DETAILS SCREEN TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockRouter = {
  back: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

let mockSearchParams: { taskId?: string } = { taskId: "task-1" };
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockSearchParams,
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      View({ children, ...props }),
  };
});

jest.mock("@/components/app-app-bar", () => ({
  AppAppBar: ({ title }: { title: string }) => {
    const { Text } = require("react-native");
    return Text({ children: title });
  },
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => "MaterialCommunityIcons");

const mockTask = {
  id: "task-1",
  title: "Metformin 500mg",
  description: "Medication reminder",
  date: new Date(2026, 1, 7, 9, 0),
  patientName: "Maya Patel",
  icon: "medication" as const,
  iconBackground: "#eee",
  iconColor: "#333",
};
const mockMarkCompleted = jest.fn();
let mockTasksList: (typeof mockTask)[] = [mockTask];
jest.mock("@/providers/TaskProvider", () => ({
  useTaskProvider: () => ({
    tasks: mockTasksList,
    markCompleted: mockMarkCompleted,
  }),
}));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

import TaskDetailsScreen from "../task-details";

describe("TaskDetailsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams = { taskId: "task-1" };
    mockTasksList = [mockTask];
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Task Details title", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Task Details")).toBeTruthy();
    });

    it("renders task title", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("renders task description", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Medication reminder")).toBeTruthy();
    });

    it("renders Date label", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Date")).toBeTruthy();
    });

    it("renders Patient label when task has patient", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Patient")).toBeTruthy();
      expect(screen.getAllByText("Maya Patel").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Mark as Complete button for incomplete task", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Mark as Complete")).toBeTruthy();
    });

    it("renders Snooze and Skip Today buttons", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Snooze")).toBeTruthy();
      expect(screen.getByText("Skip Today")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("Mark as Complete calls router.back", () => {
      render(<TaskDetailsScreen />);
      fireEvent.press(screen.getByText("Mark as Complete"));
      expect(mockRouter.back).toHaveBeenCalled();
    });

    it("Snooze button is pressable", () => {
      render(<TaskDetailsScreen />);
      fireEvent.press(screen.getByText("Snooze"));
      expect(screen.getByText("Snooze")).toBeTruthy();
    });

    it("Skip Today button is pressable", () => {
      render(<TaskDetailsScreen />);
      fireEvent.press(screen.getByText("Skip Today"));
      expect(screen.getByText("Skip Today")).toBeTruthy();
    });
  });

  describe("Edge Cases", () => {
    it("renders task-1 when taskId is task-1", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("shows empty state when there are no tasks", () => {
      mockTasksList = [];
      render(<TaskDetailsScreen />);
      expect(screen.getByText("No task selected")).toBeTruthy();
    });

    it("uses first task when taskId is missing", () => {
      mockSearchParams = {};
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("falls back to first task when taskId does not match", () => {
      mockSearchParams = { taskId: "missing" };
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("omits patient row when patientName is empty", () => {
      mockTasksList = [{ ...mockTask, patientName: "" }];
      render(<TaskDetailsScreen />);
      expect(screen.queryByText("Patient")).toBeNull();
    });

    it("omits patient row when patientName is undefined", () => {
      const task = { ...mockTask };
      delete (task as { patientName?: string }).patientName;
      mockTasksList = [task];
      render(<TaskDetailsScreen />);
      expect(screen.queryByText("Patient")).toBeNull();
    });

    it("shows completed banner when task has completedAt", () => {
      mockTasksList = [
        { ...mockTask, completedAt: new Date(2026, 1, 7, 10, 0) },
      ];
      render(<TaskDetailsScreen />);
      expect(screen.getByText("Completed")).toBeTruthy();
      expect(screen.queryByText("Mark as Complete")).toBeNull();
    });

    it("calls markCompleted when marking an incomplete task", () => {
      render(<TaskDetailsScreen />);
      fireEvent.press(screen.getByLabelText("Mark task as complete"));
      expect(mockMarkCompleted).toHaveBeenCalledWith("task-1");
    });

    it("Mark complete and outline buttons hit pressed style branches", () => {
      render(<TaskDetailsScreen />);
      const complete = screen.getByLabelText("Mark task as complete");
      fireEvent(complete, "pressIn");
      fireEvent(complete, "pressOut");
      const snooze = screen.getByText("Snooze");
      fireEvent(snooze, "pressIn");
      fireEvent(snooze, "pressOut");
      const skip = screen.getByText("Skip Today");
      fireEvent(skip, "pressIn");
      fireEvent(skip, "pressOut");
    });
  });

  describe("Accessibility", () => {
    it("Mark as Complete has accessibility label", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByLabelText("Mark task as complete")).toBeTruthy();
    });
  });
});
