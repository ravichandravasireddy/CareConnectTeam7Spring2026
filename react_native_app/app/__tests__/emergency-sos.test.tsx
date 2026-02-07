// =============================================================================
// EMERGENCY SOS ALERT SCREEN TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      View({ children, ...props }),
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

import EmergencySOSAlertScreen from "../emergency-sos";

describe("EmergencySOSAlertScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders EMERGENCY ALERT header", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText(/EMERGENCY/)).toBeTruthy();
      expect(screen.getByText(/ALERT/)).toBeTruthy();
    });

    it("renders patient info", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText("From: Robert Williams")).toBeTruthy();
      expect(screen.getByText("Patient ID: #RW-2847")).toBeTruthy();
    });

    it("renders timestamp", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText("2 minutes ago")).toBeTruthy();
    });

    it("renders patient details", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText("Robert Williams")).toBeTruthy();
      expect(screen.getByText(/Age 67/)).toBeTruthy();
    });

    it("renders location", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText("Patient Location")).toBeTruthy();
      expect(screen.getByText("742 Evergreen Terrace")).toBeTruthy();
      expect(screen.getByText("Springfield, IL 62701")).toBeTruthy();
    });

    it("renders Acknowledge Alert button", () => {
      render(<EmergencySOSAlertScreen />);
      expect(screen.getByText("Acknowledge Alert")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("shows acknowledged state when Acknowledge pressed", () => {
      render(<EmergencySOSAlertScreen />);
      fireEvent.press(screen.getByText("Acknowledge Alert"));

      expect(screen.getByText("Alert Acknowledged")).toBeTruthy();
      expect(screen.getByText("This alert has been cleared.")).toBeTruthy();
      expect(screen.getByText(/redirected in 3 seconds/)).toBeTruthy();
    });

    it("calls router.back after 3 seconds when acknowledged", () => {
      render(<EmergencySOSAlertScreen />);
      fireEvent.press(screen.getByText("Acknowledge Alert"));

      expect(mockBack).not.toHaveBeenCalled();
      jest.advanceTimersByTime(3000);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has accessibilityRole alert on main container", () => {
      render(<EmergencySOSAlertScreen />);
      const alertContainer = screen.getByLabelText(/Emergency alert from Robert Williams/);
      expect(alertContainer.props.accessibilityRole).toBe("alert");
    });

    it("acknowledge button has accessibility hint", () => {
      render(<EmergencySOSAlertScreen />);
      const button = screen.getByLabelText("Acknowledge emergency alert");
      expect(button.props.accessibilityHint).toContain("3 seconds");
    });

    it("acknowledged state has accessibilityRole summary", () => {
      render(<EmergencySOSAlertScreen />);
      fireEvent.press(screen.getByText("Acknowledge Alert"));
      const [status] = screen.getAllByLabelText(/Alert acknowledged/);
      expect(status.props.accessibilityRole).toBe("summary");
    });
  });

  describe("Edge Cases", () => {
    it("acknowledge button is pressable multiple times without error", () => {
      render(<EmergencySOSAlertScreen />);
      const button = screen.getByText("Acknowledge Alert");
      fireEvent.press(button);
      fireEvent.press(button);
      expect(screen.getByText("Alert Acknowledged")).toBeTruthy();
    });

    it("does not call router.back before 3 seconds", () => {
      render(<EmergencySOSAlertScreen />);
      fireEvent.press(screen.getByText("Acknowledge Alert"));
      jest.advanceTimersByTime(2999);
      expect(mockBack).not.toHaveBeenCalled();
    });
  });
});
