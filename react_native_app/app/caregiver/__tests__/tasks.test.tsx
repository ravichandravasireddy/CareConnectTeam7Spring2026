// =============================================================================
// CAREGIVER TASKS SCREEN TESTS
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

import CaregiverTaskManagementScreen from "../tasks";

describe("CaregiverTaskManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Tasks title", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Tasks")).toBeTruthy();
    });

    it("renders Overdue Tasks section", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Overdue Tasks (2)")).toBeTruthy();
    });

    it("renders patient name in overdue item", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Maya Patel")).toBeTruthy();
    });

    it("renders medication reminder text", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Medication reminder:")).toBeTruthy();
    });

    it("renders Metformin task title", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("renders Due 30 min ago", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Due 30 min ago")).toBeTruthy();
    });

    it("renders Notify button", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Notify")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("Notify button is pressable", () => {
      render(<CaregiverTaskManagementScreen />);
      fireEvent.press(screen.getByText("Notify"));
      expect(screen.getByText("Notify")).toBeTruthy();
    });

    it("overdue task card navigates to task details on press", () => {
      render(<CaregiverTaskManagementScreen />);
      const taskCard = screen.getByLabelText(/Maya Patel/);
      fireEvent.press(taskCard);
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: "/caregiver/task-details",
        params: { taskId: "task-1" },
      });
    });
  });

  describe("Accessibility", () => {
    it("overdue task has accessibility label", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByLabelText(/Maya Patel.*medication reminder/)).toBeTruthy();
    });

    it("Notify button has accessibility label", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByLabelText("Notify patient")).toBeTruthy();
    });
  });
});
