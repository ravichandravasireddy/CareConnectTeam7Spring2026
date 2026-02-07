// =============================================================================
// APP BOTTOM NAV BAR TESTS
// =============================================================================
// Caregiver/patient variants, currentIndex, navigation, useUser fallback.
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn() }),
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
}));

jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockUseUser = jest.fn(() => ({ isPatient: false }));
jest.mock("@/providers/UserProvider", () => {
  const actual = jest.requireActual("@/providers/UserProvider");
  return {
    ...actual,
    useUser: () => mockUseUser(),
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const R = require("react");
  const { View } = require("react-native");
  return function MockIcon({ name, testID }: { name: string; testID?: string }) {
    return R.createElement(View, { testID: testID || `icon-${name}` });
  };
});

import {
  AppBottomNavBar,
  kCaregiverNavHome,
  kCaregiverNavTasks,
  kCaregiverNavAnalytics,
  kCaregiverNavMonitor,
  kPatientNavHome,
  kPatientNavTasks,
  kPatientNavHealth,
  kPatientNavProfile,
} from "../app-bottom-nav-bar";
import { UserProvider } from "@/providers/UserProvider";

describe("AppBottomNavBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ isPatient: false });
  });

  describe("constants", () => {
    it("exports caregiver nav indices", () => {
      expect(kCaregiverNavHome).toBe(0);
      expect(kCaregiverNavTasks).toBe(1);
      expect(kCaregiverNavAnalytics).toBe(2);
      expect(kCaregiverNavMonitor).toBe(3);
    });
    it("exports patient nav indices", () => {
      expect(kPatientNavHome).toBe(0);
      expect(kPatientNavTasks).toBe(1);
      expect(kPatientNavHealth).toBe(3);
      expect(kPatientNavProfile).toBe(4);
    });
  });

  describe("caregiver variant", () => {
    it("renders caregiver tabs when isPatient is false", () => {
      render(<AppBottomNavBar currentIndex={0} isPatient={false} />);
      expect(screen.getByLabelText("Home")).toBeTruthy();
      expect(screen.getByLabelText("Tasks")).toBeTruthy();
      expect(screen.getByLabelText("Analytics")).toBeTruthy();
      expect(screen.getByLabelText("Monitor")).toBeTruthy();
    });

    it("uses useUser when isPatient is not passed and shows caregiver tabs", () => {
      mockUseUser.mockReturnValue({ isPatient: false });
      render(
        <UserProvider initialRole="caregiver">
          <AppBottomNavBar currentIndex={kCaregiverNavHome} />
        </UserProvider>
      );
      expect(screen.getByLabelText("Analytics")).toBeTruthy();
      expect(screen.getByLabelText("Monitor")).toBeTruthy();
    });

    it("marks active tab as selected", () => {
      render(<AppBottomNavBar currentIndex={kCaregiverNavTasks} isPatient={false} />);
      const tasksButton = screen.getByLabelText("Tasks");
      expect(tasksButton.props.accessibilityState?.selected).toBe(true);
    });

    it("navigates to route when pressing inactive tab", () => {
      render(<AppBottomNavBar currentIndex={kCaregiverNavHome} isPatient={false} />);
      fireEvent.press(screen.getByLabelText("Tasks"));
      expect(mockPush).toHaveBeenCalledWith("/caregiver/tasks");
    });

    it("does not navigate when pressing already active tab", () => {
      render(<AppBottomNavBar currentIndex={kCaregiverNavHome} isPatient={false} />);
      fireEvent.press(screen.getByLabelText("Home"));
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("navigates to analytics when pressing Analytics", () => {
      render(<AppBottomNavBar currentIndex={kCaregiverNavHome} isPatient={false} />);
      fireEvent.press(screen.getByLabelText("Analytics"));
      expect(mockPush).toHaveBeenCalledWith("/caregiver/analytics");
    });

    it("navigates to monitor when pressing Monitor", () => {
      render(<AppBottomNavBar currentIndex={kCaregiverNavHome} isPatient={false} />);
      fireEvent.press(screen.getByLabelText("Monitor"));
      expect(mockPush).toHaveBeenCalledWith("/caregiver/monitor");
    });
  });

  describe("patient variant", () => {
    it("renders patient tabs when isPatient is true", () => {
      render(<AppBottomNavBar currentIndex={0} isPatient={true} />);
      expect(screen.getByLabelText("Home")).toBeTruthy();
      expect(screen.getByLabelText("Tasks")).toBeTruthy();
      expect(screen.getByLabelText("Messages")).toBeTruthy();
      expect(screen.getByLabelText("Health")).toBeTruthy();
      expect(screen.getByLabelText("Profile")).toBeTruthy();
    });

    it("uses useUser when isPatient not passed and shows patient tabs when role is patient", () => {
      mockUseUser.mockReturnValue({ isPatient: true });
      render(
        <UserProvider initialRole="patient">
          <AppBottomNavBar currentIndex={kPatientNavHome} />
        </UserProvider>
      );
      expect(screen.getByLabelText("Messages")).toBeTruthy();
      expect(screen.getByLabelText("Health")).toBeTruthy();
      expect(screen.getByLabelText("Profile")).toBeTruthy();
    });

    it("navigates to health-logs when pressing Health", () => {
      render(<AppBottomNavBar currentIndex={kPatientNavHome} isPatient={true} />);
      fireEvent.press(screen.getByLabelText("Health"));
      expect(mockPush).toHaveBeenCalledWith("/health-logs");
    });
  });

  describe("currentIndex clamping", () => {
    it("treats negative currentIndex as 0", () => {
      render(<AppBottomNavBar currentIndex={-1} isPatient={false} />);
      const home = screen.getByLabelText("Home");
      expect(home.props.accessibilityState?.selected).toBe(true);
    });

    it("treats out-of-range currentIndex as last tab", () => {
      render(<AppBottomNavBar currentIndex={99} isPatient={false} />);
      const monitor = screen.getByLabelText("Monitor");
      expect(monitor.props.accessibilityState?.selected).toBe(true);
    });
  });
});
