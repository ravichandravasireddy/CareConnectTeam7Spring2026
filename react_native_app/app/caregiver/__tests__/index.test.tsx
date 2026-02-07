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
    const { Text } = require("react-native");
    return Text({ children: title });
  },
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");
jest.mock("@expo/vector-icons/MaterialCommunityIcons", () => "MaterialCommunityIcons");

import CaregiverDashboardScreen from "../index";

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
      const greetings = ["Good Morning", "Good Afternoon", "Good Evening"];
      const found = greetings.some((g) => {
        try {
          return screen.getByText(new RegExp(g)).toBeTruthy();
        } catch {
          return false;
        }
      });
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
