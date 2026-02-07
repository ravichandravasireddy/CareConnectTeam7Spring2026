// =============================================================================
// NAVIGATION HUB SCREEN TESTS
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

import NavigationHubScreen from "../navigation-hub";

describe("NavigationHubScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Navigation Hub title", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Navigation Hub")).toBeTruthy();
    });

    it("renders subtitle", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Tap a button to open a screen.")).toBeTruthy();
    });

    it("renders section labels", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Auth & onboarding")).toBeTruthy();
      expect(screen.getByText("Caregiver")).toBeTruthy();
      expect(screen.getByText("Shared & other")).toBeTruthy();
    });

    it("renders Welcome button", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Welcome")).toBeTruthy();
    });

    it("renders caregiver navigation buttons", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Caregiver Dashboard")).toBeTruthy();
      expect(screen.getByText("Caregiver: Patient Monitoring")).toBeTruthy();
      expect(screen.getByText("Caregiver: Task Management")).toBeTruthy();
      expect(screen.getByText("Caregiver: Analytics")).toBeTruthy();
    });

    it("renders Emergency SOS Alert button", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Emergency SOS Alert")).toBeTruthy();
    });

    it("renders Task Details button", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByText("Task Details (sample)")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("Welcome button calls router.replace with /", () => {
      render(<NavigationHubScreen />);
      fireEvent.press(screen.getByText("Welcome"));
      expect(mockRouter.replace).toHaveBeenCalledWith("/");
    });

    it("Caregiver Dashboard button calls router.replace with /caregiver", () => {
      render(<NavigationHubScreen />);
      fireEvent.press(screen.getByText("Caregiver Dashboard"));
      expect(mockRouter.replace).toHaveBeenCalledWith("/caregiver");
    });

    it("Emergency SOS button calls router.push with /emergency-sos", () => {
      render(<NavigationHubScreen />);
      fireEvent.press(screen.getByText("Emergency SOS Alert"));
      expect(mockRouter.push).toHaveBeenCalledWith("/emergency-sos");
    });

    it("Task Details button calls router.push with pathname and params", () => {
      render(<NavigationHubScreen />);
      fireEvent.press(screen.getByText("Task Details (sample)"));
      expect(mockRouter.push).toHaveBeenCalledWith({
        pathname: "/caregiver/task-details",
        params: { taskId: "task-1" },
      });
    });

    it("Role Selection button does not throw", () => {
      render(<NavigationHubScreen />);
      expect(() => fireEvent.press(screen.getByText("Role Selection"))).not.toThrow();
    });
  });

  describe("Accessibility", () => {
    it("buttons have accessibilityLabel", () => {
      render(<NavigationHubScreen />);
      expect(screen.getByLabelText("Welcome")).toBeTruthy();
      expect(screen.getByLabelText("Caregiver Dashboard")).toBeTruthy();
      expect(screen.getByLabelText("Emergency SOS Alert")).toBeTruthy();
    });

    it("buttons have accessibilityRole button", () => {
      render(<NavigationHubScreen />);
      const btn = screen.getByLabelText("Welcome");
      expect(btn.props.accessibilityRole).toBe("button");
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid button presses", () => {
      render(<NavigationHubScreen />);
      fireEvent.press(screen.getByText("Welcome"));
      fireEvent.press(screen.getByText("Welcome"));
      expect(mockRouter.replace).toHaveBeenCalledTimes(2);
    });
  });
});
