// =============================================================================
// APP APP BAR COMPONENT TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

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

    it("renders notification button when onNotificationTap provided", () => {
      render(
        <AppAppBar title="Test" onNotificationTap={() => {}} />
      );
      expect(screen.getByLabelText("Notifications")).toBeTruthy();
    });

    it("shows notification badge label when showNotificationBadge is true", () => {
      render(
        <AppAppBar
          title="Test"
          onNotificationTap={() => {}}
          showNotificationBadge
        />
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
    it("calls onNotificationTap when notification pressed", () => {
      const onNotificationTap = jest.fn();
      render(
        <AppAppBar title="Test" onNotificationTap={onNotificationTap} />
      );
      fireEvent.press(screen.getByLabelText("Notifications"));
      expect(onNotificationTap).toHaveBeenCalledTimes(1);
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
