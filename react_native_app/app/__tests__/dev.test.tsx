// =============================================================================
// DEV SCREEN COMPONENT TESTS
// =============================================================================
// SWEN 661 - Verifies dev screen rendering, interactions, and accessibility.
//
// KEY CONCEPTS COVERED:
// 1. Screen rendering with React Native Testing Library (RNTL)
// 2. User interactions (link presses, navigation)
// 3. Accessibility labels and roles
// 4. Theme/color scheme handling
// 5. Component links list rendering
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";

// Mock react-native
jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    ScrollView: (props: unknown) => React.createElement("ScrollView", props),
    TouchableOpacity: (props: unknown) => React.createElement("TouchableOpacity", props),
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
      flatten: (style: unknown) => style,
      absoluteFill: {},
      absoluteFillObject: {},
    },
    useColorScheme: jest.fn(() => "light"),
    useWindowDimensions: jest.fn(() => ({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    })),
    Platform: { OS: "ios", select: (opts: Record<string, unknown>) => opts?.default ?? opts?.ios },
  };
});

// Mock expo-router
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => false),
  })),
}));

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(View, { testID: "safe-area-view", ...props }, children),
  };
});

// Mock MaterialIcons
jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  return jest.fn(({ name, testID, ...props }: { name: string; testID?: string }) =>
    React.createElement("View", { testID: testID || `icon-${name}`, ...props })
  );
});

// Mock use-color-scheme
jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

import DevScreen from "../dev";

describe("DevScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (RN.useColorScheme as jest.Mock).mockReturnValue("light");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // Screen Rendering
  // ===========================================================================

  describe("Screen Rendering", () => {
    it("renders screen title", () => {
      render(<DevScreen />);
      expect(screen.getByText("Component Links")).toBeTruthy();
    });

    it("renders subtitle", () => {
      render(<DevScreen />);
      expect(screen.getByText("Development screen - temporary")).toBeTruthy();
    });

    it("renders SafeAreaView", () => {
      render(<DevScreen />);
      const safeArea = screen.getByTestId("safe-area-view");
      expect(safeArea).toBeTruthy();
    });

    it("renders Calendar link when COMPONENT_LINKS includes it", () => {
      render(<DevScreen />);
      expect(screen.getByText("Calendar")).toBeTruthy();
      expect(screen.getByText("Month calendar with task scheduling")).toBeTruthy();
    });

    it("renders link cards with chevron icon", () => {
      render(<DevScreen />);
      expect(screen.getAllByTestId("icon-chevron-right")).toBeTruthy();
    });

    it("renders link icon when link has icon", () => {
      render(<DevScreen />);
      expect(screen.getByTestId("icon-calendar-today")).toBeTruthy();
    });
  });

  // ===========================================================================
  // User Interactions
  // ===========================================================================

  describe("User Interactions", () => {
    it("calls router.push with /calendar when Calendar link is pressed", () => {
      render(<DevScreen />);
      const calendarLink = screen.getByText("Calendar");
      fireEvent.press(calendarLink);
      expect(mockPush).toHaveBeenCalledWith("/calendar");
    });

    it("calls router.push when link card is pressed", () => {
      render(<DevScreen />);
      const description = screen.getByText("Month calendar with task scheduling");
      fireEvent.press(description);
      expect(mockPush).toHaveBeenCalledWith("/calendar");
    });

    it("handles multiple link presses", () => {
      render(<DevScreen />);
      const calendarLink = screen.getByText("Calendar");
      fireEvent.press(calendarLink);
      fireEvent.press(calendarLink);
      expect(mockPush).toHaveBeenCalledTimes(2);
      expect(mockPush).toHaveBeenNthCalledWith(1, "/calendar");
      expect(mockPush).toHaveBeenNthCalledWith(2, "/calendar");
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe("Accessibility", () => {
    it("has accessibility label on Calendar link", () => {
      render(<DevScreen />);
      const link = screen.getByLabelText("Navigate to Calendar");
      expect(link).toBeTruthy();
    });

    it("has accessibility role button on link", () => {
      render(<DevScreen />);
      const link = screen.getByLabelText("Navigate to Calendar");
      expect(link.props.accessibilityRole).toBe("button");
    });

    it("has accessibility hint on link", () => {
      render(<DevScreen />);
      const link = screen.getByLabelText("Navigate to Calendar");
      expect(link.props.accessibilityHint).toBe("Month calendar with task scheduling");
    });
  });

  // ===========================================================================
  // Theme & Color Scheme
  // ===========================================================================

  describe("Theme & Color Scheme", () => {
    it("renders with light theme when color scheme is light", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("light");
      render(<DevScreen />);
      expect(screen.getByText("Component Links")).toBeTruthy();
    });

    it("renders with dark theme when color scheme is dark", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("dark");
      render(<DevScreen />);
      expect(screen.getByText("Component Links")).toBeTruthy();
    });

    it("handles null color scheme gracefully", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue(null);
      render(<DevScreen />);
      expect(screen.getByText("Component Links")).toBeTruthy();
    });
  });

  // ===========================================================================
  // Component Structure
  // ===========================================================================

  describe("Component Structure", () => {
    it("renders ScrollView with scrollable content", () => {
      render(<DevScreen />);
      expect(screen.getByText("Component Links")).toBeTruthy();
      expect(screen.getByText("Calendar")).toBeTruthy();
    });

    it("renders at least one link card", () => {
      render(<DevScreen />);
      const calendarTitle = screen.getByText("Calendar");
      expect(calendarTitle).toBeTruthy();
    });
  });
});
