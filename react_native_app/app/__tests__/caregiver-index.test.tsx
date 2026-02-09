// =============================================================================
// CAREGIVER DASHBOARD SCREEN TESTS
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

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, ...props }: { children?: React.ReactNode }) =>
      View({ children, testID: "linear-gradient", ...props }),
  };
});

jest.mock("@/components/app-app-bar", () => ({
  AppAppBar: ({ title }: { title: string }) => {
    const React = require("react");
    const { Text, View } = require("react-native");
    return React.createElement(View, { testID: "app-app-bar" }, React.createElement(Text, {}, title));
  },
}));

jest.mock("@/components/app-menu", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    AppMenu: () => React.createElement(View, { testID: "app-menu" }),
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  function MockMaterialIcons(props: { name: string; testID?: string }) {
    const { name, testID, ...rest } = props;
    return React.createElement(View, { testID: testID || `icon-${name}`, ...rest });
  }
  MockMaterialIcons.displayName = "MaterialIcons";
  return MockMaterialIcons;
});
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  function MockMaterialCommunityIcons(props: { name: string; testID?: string }) {
    const { name, testID, ...rest } = props;
    return React.createElement(View, { testID: testID || `icon-mc-${name}`, ...rest });
  }
  MockMaterialCommunityIcons.displayName = "MaterialCommunityIcons";
  return MockMaterialCommunityIcons;
});

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("@/providers/TaskProvider", () => ({
  useTaskProvider: () => ({
    getTasksForDate: () => [],
  }),
}));

import CaregiverDashboardScreen from "../caregiver/index";

describe("CaregiverDashboardScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Dashboard title via AppAppBar", () => {
      render(<CaregiverDashboardScreen />);
      expect(screen.getByText("Dashboard")).toBeTruthy();
    });

    it("renders Today's Tasks section", () => {
      render(<CaregiverDashboardScreen />);
      expect(screen.getByText("Today's Tasks")).toBeTruthy();
    });

    it("renders Manage link", () => {
      render(<CaregiverDashboardScreen />);
      expect(screen.getByText("Manage")).toBeTruthy();
    });

    it("renders welcome card with greeting", () => {
      render(<CaregiverDashboardScreen />);
      
      expect(
        screen.getByText(/Here's your care overview for today/)
      ).toBeTruthy();
    });

    it("renders stat cards", () => {
      render(<CaregiverDashboardScreen />);
      expect(screen.getByText("Patients")).toBeTruthy();
      expect(screen.getByText("Tasks")).toBeTruthy();
      expect(screen.getByText("Alerts")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("Manage button is pressable", () => {
      render(<CaregiverDashboardScreen />);
      fireEvent.press(screen.getByText("Manage"));
      expect(mockRouter.push).toHaveBeenCalledWith("/caregiver/tasks");
    });

    it("Patients stat navigates to monitor", () => {
      render(<CaregiverDashboardScreen />);
      const patientsCard = screen.getByLabelText(/Patients.*tap to view/);
      fireEvent.press(patientsCard);
      expect(mockRouter.push).toHaveBeenCalledWith("/caregiver/monitor");
    });

    it("Tasks stat navigates to tasks", () => {
      render(<CaregiverDashboardScreen />);
      const tasksCard = screen.getByLabelText("Tasks, tap to manage tasks");
      fireEvent.press(tasksCard);
      expect(mockRouter.push).toHaveBeenCalledWith("/caregiver/tasks");
    });

    it("Alerts stat navigates to emergency-sos", () => {
      render(<CaregiverDashboardScreen />);
      const alertsCard = screen.getByLabelText(/Alerts.*1 unread/);
      fireEvent.press(alertsCard);
      expect(mockRouter.push).toHaveBeenCalledWith("/emergency-sos");
    });
  });

  describe("Accessibility", () => {
    it("has accessibility label on container", () => {
      render(<CaregiverDashboardScreen />);
      expect(
        screen.getByLabelText("Caregiver dashboard. Quick stats and today's tasks.")
      ).toBeTruthy();
    });

    it("quick stats region has accessibility label", () => {
      render(<CaregiverDashboardScreen />);
      expect(screen.getAllByLabelText(/Quick stats/).length).toBeGreaterThan(0);
    });
  });
});
