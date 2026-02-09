// =============================================================================
// APP MENU COMPONENT TESTS
// =============================================================================

import React from "react";
import { Alert } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn(), push: mockPush, replace: mockReplace }),
}));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme"); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

let mockIsPatient = true;
jest.mock("@/providers/UserProvider", () => ({
  useUser: () => ({ isPatient: mockIsPatient }),
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react"); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require("react-native"); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    Ionicons: (props: Record<string, unknown>) => React.createElement(View, { ...props, testID: "icon" }),
  };
});

// eslint-disable-next-line import/first -- mocks must be above component import so Jest applies them
import { AppMenu } from "../app-menu";

describe("AppMenu", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockIsPatient = true;
  });

  describe("Rendering", () => {
    it("renders Menu title when visible", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      expect(screen.getByText("Menu")).toBeTruthy();
    });

    it("renders patient menu items when user is patient", () => {
      mockIsPatient = true;
      render(<AppMenu visible={true} onClose={onClose} />);
      expect(screen.getByLabelText("Home")).toBeTruthy();
      expect(screen.getByLabelText("Tasks")).toBeTruthy();
      expect(screen.getByLabelText("Messages")).toBeTruthy();
      expect(screen.getByLabelText("Health Logs")).toBeTruthy();
      expect(screen.getByLabelText("Profile")).toBeTruthy();
      expect(screen.getByLabelText("Sign Out")).toBeTruthy();
      expect(screen.getByLabelText("Cancel")).toBeTruthy();
    });

    it("renders caregiver menu items when user is not patient", () => {
      mockIsPatient = false;
      render(<AppMenu visible={true} onClose={onClose} />);
      expect(screen.getByLabelText("Dashboard")).toBeTruthy();
      expect(screen.getByLabelText("Patients")).toBeTruthy();
      expect(screen.getByLabelText("Tasks")).toBeTruthy();
      expect(screen.getByLabelText("Analytics")).toBeTruthy();
      expect(screen.getByLabelText("Sign Out")).toBeTruthy();
      expect(screen.getByLabelText("Cancel")).toBeTruthy();
    });

    it("has close menu accessibility on overlay", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      expect(screen.getByLabelText("Close menu")).toBeTruthy();
    });
  });

  describe("Interactions", () => {
    it("calls onClose when Cancel is pressed", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Cancel"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose and router.push when a menu item is pressed", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Home"));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/patient");
    });

    it("navigates to preferences when Preferences is pressed", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Preferences"));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/preferences-accessibility");
    });

    it("calls onClose when overlay (Close menu) is pressed", () => {
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Close menu"));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("shows sign out alert when Sign Out is pressed", () => {
      jest.spyOn(Alert, "alert").mockImplementation(() => {});
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Sign Out"));
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(Alert.alert).toHaveBeenCalledWith(
        "Sign Out",
        "Are you sure you want to sign out?",
        expect.any(Array)
      );
    });

    it("replaces to sign-in when Sign Out is confirmed in alert", () => {
      let signOutCallback: (() => void) | undefined;
      jest.spyOn(Alert, "alert").mockImplementation((_title, _message, buttons) => {
        const signOutButton = Array.isArray(buttons) ? buttons.find((b: { text?: string }) => b?.text === "Sign Out") : undefined;
        signOutCallback = signOutButton?.onPress;
      });
      render(<AppMenu visible={true} onClose={onClose} />);
      fireEvent.press(screen.getByLabelText("Sign Out"));
      expect(signOutCallback).toBeDefined();
      signOutCallback?.();
      expect(mockReplace).toHaveBeenCalledWith("/sign-in");
    });
  });
});
