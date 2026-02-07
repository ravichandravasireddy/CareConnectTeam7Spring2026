// =============================================================================
// APP APP BAR COMPONENT TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: jest.fn(),
  }),
}));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

import { AppAppBar } from "../app-app-bar";

describe("AppAppBar", () => {
  describe("Rendering - Normal Cases", () => {
    it("renders title", () => {
      render(<AppAppBar title="Dashboard" />);
      expect(screen.getByText("Dashboard")).toBeTruthy();
    });

    it("renders menu button when showMenuButton is true", () => {
      render(<AppAppBar title="Test" showMenuButton />);
      expect(screen.getByLabelText("Menu")).toBeTruthy();
    });

    it("renders back button when useBackButton is true", () => {
      render(<AppAppBar title="Test" useBackButton showMenuButton={false} />);
      expect(screen.getByLabelText("Go back")).toBeTruthy();
    });

    it("renders notification button by default", () => {
      render(<AppAppBar title="Test" />);
      expect(screen.getByLabelText("Notifications")).toBeTruthy();
    });

    it("hides notification button when showNotificationButton is false", () => {
      render(<AppAppBar title="Test" showNotificationButton={false} />);
      expect(screen.queryByLabelText("Notifications")).toBeNull();
    });

    it("shows notification badge label when showNotificationBadge is true", () => {
      render(
        <AppAppBar title="Test" showNotificationBadge />
      );
      expect(
        screen.getByLabelText("Notifications, 1 unread notification")
      ).toBeTruthy();
    });

    it("renders settings button when onSettingsPress provided", () => {
      render(
        <AppAppBar title="Test" onSettingsPress={() => {}} />
      );
      expect(screen.getByLabelText("Settings")).toBeTruthy();
    });
  });

  describe("Rendering - Edge Cases", () => {
    it("renders with empty title", () => {
      render(<AppAppBar title="" />);
      expect(screen.getByText("")).toBeTruthy();
    });

    it("renders with long title", () => {
      const longTitle = "A".repeat(100);
      render(<AppAppBar title={longTitle} />);
      expect(screen.getByText(longTitle)).toBeTruthy();
    });

    it("prioritizes back button over menu when both could apply", () => {
      render(<AppAppBar title="Test" useBackButton showMenuButton />);
      expect(screen.getByLabelText("Go back")).toBeTruthy();
      expect(screen.queryByLabelText("Menu")).toBeNull();
    });

    it("renders placeholder when neither menu nor back", () => {
      render(<AppAppBar title="Test" showMenuButton={false} useBackButton={false} />);
      expect(screen.getByText("Test")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("calls router.back when back button pressed", () => {
      render(<AppAppBar title="Test" useBackButton showMenuButton={false} />);
      fireEvent.press(screen.getByLabelText("Go back"));
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("calls router.push('/notifications') when notification pressed by default", () => {
      render(<AppAppBar title="Test" />);
      fireEvent.press(screen.getByLabelText("Notifications"));
      expect(mockPush).toHaveBeenCalledWith("/notifications");
    });

    it("calls onSettingsPress when settings pressed", () => {
      const onSettingsPress = jest.fn();
      render(
        <AppAppBar title="Test" onSettingsPress={onSettingsPress} />
      );
      fireEvent.press(screen.getByLabelText("Settings"));
      expect(onSettingsPress).toHaveBeenCalledTimes(1);
    });

    it("menu button press does not throw when no handler", () => {
      render(<AppAppBar title="Test" showMenuButton />);
      expect(() => fireEvent.press(screen.getByLabelText("Menu"))).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("back button has accessibilityRole button", () => {
      render(<AppAppBar title="Test" useBackButton showMenuButton={false} />);
      const backBtn = screen.getByLabelText("Go back");
      expect(backBtn.props.accessibilityRole).toBe("button");
    });

    it("menu button has accessibilityRole button", () => {
      render(<AppAppBar title="Test" />);
      const menuBtn = screen.getByLabelText("Menu");
      expect(menuBtn.props.accessibilityRole).toBe("button");
    });
  });
});
