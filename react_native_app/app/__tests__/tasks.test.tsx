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
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => "MaterialCommunityIcons");

const mockOverdueTask = {
  id: "task-1",
  title: "Metformin 500mg",
  description: "Medication reminder",
  date: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
  patientName: "Maya Patel",
  icon: "medication" as const,
  iconBackground: "#eee",
  iconColor: "#333",
};
jest.mock("@/providers/TaskProvider", () => ({
  useTaskProvider: () => ({ tasks: [mockOverdueTask] }),
}));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

import CaregiverTaskManagementScreen from "../caregiver/tasks";

describe("CaregiverTaskManagementScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Tasks title", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Tasks")).toBeTruthy();
    });

    it("renders Overdue Tasks section with count", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Overdue Tasks (1)")).toBeTruthy();
    });

    it("renders patient name in overdue item", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Maya Patel")).toBeTruthy();
    });

    it("renders medication reminder description", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Medication reminder")).toBeTruthy();
    });

    it("renders Metformin task title", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText("Metformin 500mg")).toBeTruthy();
    });

    it("renders task time", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByText(/\d{1,2}:\d{2}\s*(AM|PM)/)).toBeTruthy();
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
      expect(screen.getByLabelText(/Metformin 500mg.*Maya Patel/)).toBeTruthy();
    });

    it("Notify button has accessibility label", () => {
      render(<CaregiverTaskManagementScreen />);
      expect(screen.getByLabelText("Notify patient")).toBeTruthy();
    });
  });
});
