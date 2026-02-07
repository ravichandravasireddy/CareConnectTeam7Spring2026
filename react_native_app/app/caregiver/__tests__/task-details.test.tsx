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
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ taskId: "task-1" }),
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

import TaskDetailsScreen from "../task-details";

describe("TaskDetailsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      expect(screen.getByText("Maya Patel")).toBeTruthy();
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
  });

  describe("Accessibility", () => {
    it("Mark as Complete has accessibility label", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByLabelText("Mark task as complete")).toBeTruthy();
    });
  });
});
