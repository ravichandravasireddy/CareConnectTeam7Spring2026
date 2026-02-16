/**
 * Integration tests: Multi-screen workflows
 * Assignment 6: "Integration tests - Multi-screen workflows (e.g., login → dashboard → task)"
 * Uses Jest + React Native Testing Library
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = { back: mockBack, push: mockPush, replace: mockReplace };

jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => ({ taskId: "task-1" }),
}));
jest.mock("@/providers/Providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
jest.mock("@/providers/UserProvider", () => ({
  useUser: () => ({ isPatient: false, setUserRole: jest.fn(), setUserInfo: jest.fn() }),
}));
jest.mock("@/providers/TaskProvider", () => ({
  useTaskProvider: () => ({
    tasks: [
      {
        id: "task-1",
        title: "Take medication",
        date: new Date(),
        patientName: "Robert Williams",
        icon: "medication",
        iconColor: "#1976D2",
        iconBackground: "#E3ECFC",
        description: "Morning dose",
        completed: false,
      },
    ],
    getTasksForDate: () => [
      {
        id: "task-1",
        title: "Take medication",
        date: new Date(),
        patientName: "Robert Williams",
        icon: "medication",
        iconColor: "#1976D2",
        iconBackground: "#E3ECFC",
        description: "Morning dose",
        completed: false,
      },
    ],
    markCompleted: jest.fn(),
  }),
}));
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: "linear-gradient" }, children),
  };
});
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, { testID: "safe-area" }, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return (props: { name: string }) =>
    React.createElement(View, { testID: `icon-${props.name}` });
});
jest.mock("@/components/app-app-bar", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    AppAppBar: ({ title }: { title: string }) =>
      React.createElement(View, { testID: "app-app-bar" }, React.createElement(Text, {}, title)),
  };
});
jest.mock("@/components/app-menu", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    AppMenu: () => React.createElement(View, { testID: "app-menu" }),
  };
});

import IndexScreen from "../index";
import CaregiverDashboardScreen from "../caregiver/index";
import TaskDetailsScreen from "../task-details";

describe("Integration: Multi-screen workflow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Welcome → Role Selection flow", () => {
    it("navigates to role-selection when Get Started is pressed", () => {
      render(<IndexScreen />);
      const getStarted = screen.getByLabelText("Get started");
      fireEvent.press(getStarted);
      expect(mockPush).toHaveBeenCalledWith("/role-selection");
    });

    it("navigates to sign-in when Sign In is pressed", () => {
      render(<IndexScreen />);
      const signIn = screen.getByLabelText("Sign in");
      fireEvent.press(signIn);
      expect(mockPush).toHaveBeenCalledWith("/sign-in");
    });
  });

  describe("Caregiver Dashboard → Task Details flow", () => {
    it("navigates to task-details when a task card is pressed", () => {
      render(<CaregiverDashboardScreen />);
      const taskCard = screen.getByLabelText(/Take medication/i);
      fireEvent.press(taskCard);
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/task-details",
        params: { taskId: "task-1" },
      });
    });

    it("navigates to caregiver/tasks when Manage is pressed", () => {
      render(<CaregiverDashboardScreen />);
      const manage = screen.getByLabelText("Manage tasks");
      fireEvent.press(manage);
      expect(mockPush).toHaveBeenCalledWith("/caregiver/tasks");
    });

    it("navigates to emergency-sos when Alerts card is pressed", () => {
      render(<CaregiverDashboardScreen />);
      const alerts = screen.getByLabelText(/Alerts.*1 unread/i);
      fireEvent.press(alerts);
      expect(mockPush).toHaveBeenCalledWith("/emergency-sos");
    });
  });

  describe("Task Details screen", () => {
    it("renders task details and Mark as Complete button", () => {
      render(<TaskDetailsScreen />);
      expect(screen.getByLabelText("Mark task as complete")).toBeTruthy();
    });
  });
});
