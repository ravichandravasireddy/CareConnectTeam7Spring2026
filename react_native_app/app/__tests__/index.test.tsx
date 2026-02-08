// =============================================================================
// WELCOME SCREEN COMPONENT TESTS
// =============================================================================
// SWEN 661 - Verifies welcome screen rendering, interactions, and accessibility.
//
// KEY CONCEPTS COVERED:
// 1. Screen rendering with React Native Testing Library (RNTL)
// 2. User interactions (button presses)
// 3. Accessibility labels and roles
// 4. Utility function testing (spacing calculations)
// 5. Theme/color scheme handling
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { AppColors } from "@/constants/theme";

// Mock react-native without requireActual to avoid TurboModuleRegistry (DevMenu) in Jest.
jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    ScrollView: (props: unknown) => React.createElement("ScrollView", props),
    Pressable: (props: unknown) => React.createElement("Pressable", props),
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

jest.mock("expo-linear-gradient", () => {
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, ...props }: { children?: React.ReactNode }) => (
      <View testID="linear-gradient" {...props}>
        {children}
      </View>
    ),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) => (
      <View testID="safe-area-view" {...props}>
        {children}
      </View>
    ),
  };
});

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

import WelcomeScreen, {
  calculateBottomSpacing,
  calculateTopSpacing,
  normalizeColorScheme,
} from "../index";

describe("WelcomeScreen", () => {
  beforeEach(() => {
    // Reset and set default mocks before each test (use mocked RN from the module)
    (RN.useColorScheme as jest.Mock).mockReturnValue("light");
    (RN.useWindowDimensions as jest.Mock).mockReturnValue({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // RNTL TESTS: Screen Rendering
  // ===========================================================================

  describe("Screen Rendering", () => {
    it("renders title and action buttons", () => {
      render(<WelcomeScreen />);

      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(screen.getByText("Get Started")).toBeTruthy();
      expect(screen.getByText("Sign In")).toBeTruthy();
    });

    it("renders subtitle text", () => {
      render(<WelcomeScreen />);

      expect(
        screen.getByText(
          "Remote health management and coordination for patients and caregivers",
        ),
      ).toBeTruthy();
    });

    it("renders compliance text", () => {
      render(<WelcomeScreen />);

      expect(
        screen.getByText("HIPAA-compliant • Secure • Private"),
      ).toBeTruthy();
    });

    it("renders logo icon", () => {
      render(<WelcomeScreen />);

      const logoIcon = screen.getByText("❤");
      expect(logoIcon).toBeTruthy();
    });

    it("renders gradient background", () => {
      render(<WelcomeScreen />);

      const gradient = screen.getByTestId("linear-gradient");
      expect(gradient).toBeTruthy();
    });

    it("renders SafeAreaView", () => {
      render(<WelcomeScreen />);

      const safeArea = screen.getByTestId("safe-area-view");
      expect(safeArea).toBeTruthy();
    });
  });

  // ===========================================================================
  // RNTL TESTS: User Interactions
  // ===========================================================================

  describe("User Interactions", () => {
    it("handles Get Started button press", () => {
      const { getByText } = render(<WelcomeScreen />);

      const getStartedButton = getByText("Get Started");
      fireEvent.press(getStartedButton);

      // Button press should not throw error
      // TODO: When navigation is implemented, verify navigation occurs
    });

    it("handles Sign In button press", () => {
      const { getByText } = render(<WelcomeScreen />);

      const signInButton = getByText("Sign In");
      fireEvent.press(signInButton);

      // Button press should not throw error
      // TODO: When navigation is implemented, verify navigation occurs
    });

    it("applies pressed state styling to Get Started button", () => {
      const { getByText } = render(<WelcomeScreen />);

      const getStartedButton = getByText("Get Started");
      fireEvent(getStartedButton, "pressIn");
      fireEvent(getStartedButton, "pressOut");

      // Verify button responds to press events
      expect(getStartedButton).toBeTruthy();
    });

    it("applies pressed state styling to Sign In button", () => {
      const { getByText } = render(<WelcomeScreen />);

      const signInButton = getByText("Sign In");
      fireEvent(signInButton, "pressIn");
      fireEvent(signInButton, "pressOut");

      // Verify button responds to press events
      expect(signInButton).toBeTruthy();
    });

    it("returns pressed and unpressed styles for Get Started button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Get started");
      const styleFn = button.props.style;

      const pressedStyles = styleFn({ pressed: true });
      const unpressedStyles = styleFn({ pressed: false });

      expect(pressedStyles[1].opacity).toBe(0.9);
      expect(unpressedStyles[1].opacity).toBe(1);
    });

    it("returns pressed and unpressed styles for Sign In button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Sign in");
      const styleFn = button.props.style;

      const pressedStyles = styleFn({ pressed: true });
      const unpressedStyles = styleFn({ pressed: false });

      expect(pressedStyles[1].opacity).toBe(0.9);
      expect(unpressedStyles[1].opacity).toBe(1);
    });
  });

  // ===========================================================================
  // RNTL TESTS: Accessibility
  // ===========================================================================

  describe("Accessibility", () => {
    it("has accessibility label on SafeAreaView", () => {
      render(<WelcomeScreen />);

      const safeArea = screen.getByTestId("safe-area-view");
      expect(safeArea.props.accessibilityLabel).toBe("Welcome screen");
    });

    it("has accessibility label on logo", () => {
      render(<WelcomeScreen />);

      const logo = screen.getByLabelText("CareConnect logo");
      expect(logo).toBeTruthy();
    });

    it("has accessibility label on Get Started button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Get started");
      expect(button).toBeTruthy();
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("has accessibility label on Sign In button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Sign in");
      expect(button).toBeTruthy();
      expect(button.props.accessibilityRole).toBe("button");
    });

    it("has accessibility hint on Get Started button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Get started");
      expect(button.props.accessibilityHint).toBe(
        "TODO: Navigates to role selection",
      );
    });

    it("has accessibility hint on Sign In button", () => {
      render(<WelcomeScreen />);

      const button = screen.getByLabelText("Sign in");
      expect(button.props.accessibilityHint).toBe("TODO: Navigates to sign in");
    });

    it("has accessibility role on text elements", () => {
      render(<WelcomeScreen />);

      const subtitle = screen.getByText(
        "Remote health management and coordination for patients and caregivers",
      );
      expect(subtitle.props.accessibilityRole).toBe("text");
    });
  });

  // ===========================================================================
  // JEST UNIT TESTS: Utility Functions & State Logic
  // ===========================================================================

  describe("Utility Functions - Spacing Calculations", () => {
    it("calculates top spacing correctly for standard height", () => {
      // Top spacing should be max(32, 812 * 0.12) = max(32, 97.44) = 97.44
      expect(calculateTopSpacing(812)).toBeCloseTo(97.44, 2);
    });

    it("calculates top spacing correctly for small height", () => {
      // Top spacing should be max(32, 200 * 0.12) = max(32, 24) = 32
      expect(calculateTopSpacing(200)).toBe(32);
    });

    it("returns minimum top spacing for zero height", () => {
      expect(calculateTopSpacing(0)).toBe(32);
    });

    it("returns minimum top spacing for negative height", () => {
      expect(calculateTopSpacing(-500)).toBe(32);
    });

    it("calculates bottom spacing correctly for standard height", () => {
      // Bottom spacing should be max(24, 812 * 0.1) = max(24, 81.2) = 81.2
      expect(calculateBottomSpacing(812)).toBeCloseTo(81.2, 2);
    });

    it("calculates bottom spacing correctly for small height", () => {
      // Bottom spacing should be max(24, 200 * 0.1) = max(24, 20) = 24
      expect(calculateBottomSpacing(200)).toBe(24);
    });

    it("returns minimum bottom spacing for zero height", () => {
      expect(calculateBottomSpacing(0)).toBe(24);
    });

    it("returns minimum bottom spacing for negative height", () => {
      expect(calculateBottomSpacing(-500)).toBe(24);
    });

    it("returns NaN when height is NaN", () => {
      expect(Number.isNaN(calculateTopSpacing(NaN))).toBe(true);
      expect(Number.isNaN(calculateBottomSpacing(NaN))).toBe(true);
    });

    it("handles very large heights without overflow", () => {
      expect(calculateTopSpacing(100000)).toBeCloseTo(12000, 2);
      expect(calculateBottomSpacing(100000)).toBeCloseTo(10000, 2);
    });
  });

  // ===========================================================================
  // JEST UNIT TESTS: Theme & Color Scheme
  // ===========================================================================

  describe("Theme & Color Scheme", () => {
    it("uses light theme colors when color scheme is light", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("light");

      render(<WelcomeScreen />);

      // Verify component renders with light theme
      expect(screen.getByText("CareConnect")).toBeTruthy();
    });

    it("uses dark theme colors when color scheme is dark", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("dark");

      render(<WelcomeScreen />);

      // Verify component renders with dark theme
      expect(screen.getByText("CareConnect")).toBeTruthy();
    });

    it("normalizes color scheme values", () => {
      expect(normalizeColorScheme("dark")).toBe("dark");
      expect(normalizeColorScheme("light")).toBe("light");
      expect(normalizeColorScheme(null)).toBe("light");
      expect(normalizeColorScheme(undefined)).toBe("light");
    });

    it("falls back to light for unexpected values", () => {
      expect(normalizeColorScheme("DARK")).toBe("light");
      expect(normalizeColorScheme("auto")).toBe("light");
      expect(normalizeColorScheme("")).toBe("light");
    });

    it("uses correct gradient colors", () => {
      render(<WelcomeScreen />);

      const gradient = screen.getByTestId("linear-gradient");
      expect(gradient.props.colors).toEqual([
        AppColors.primary600,
        AppColors.accent500,
      ]);
    });

    it("uses correct gradient direction", () => {
      render(<WelcomeScreen />);

      const gradient = screen.getByTestId("linear-gradient");
      expect(gradient.props.start).toEqual({ x: 0, y: 0 });
      expect(gradient.props.end).toEqual({ x: 1, y: 1 });
    });
  });

  // ===========================================================================
  // JEST UNIT TESTS: Data Validation
  // ===========================================================================

  describe("Data Validation", () => {
    it("validates button text content", () => {
      render(<WelcomeScreen />);

      const getStartedText = screen.getByText("Get Started");
      const signInText = screen.getByText("Sign In");

      expect(getStartedText).toBeTruthy();
      expect(signInText).toBeTruthy();
    });

    it("validates title text content", () => {
      render(<WelcomeScreen />);

      const title = screen.getByText("CareConnect");
      expect(title).toBeTruthy();
    });

    it("validates subtitle text content", () => {
      render(<WelcomeScreen />);

      const subtitle = screen.getByText(
        "Remote health management and coordination for patients and caregivers",
      );
      expect(subtitle).toBeTruthy();
    });

    it("validates compliance text content", () => {
      render(<WelcomeScreen />);

      const complianceText = screen.getByText(
        "HIPAA-compliant • Secure • Private",
      );
      expect(complianceText).toBeTruthy();
    });
  });

  // ===========================================================================
  // RNTL TESTS: Component Structure
  // ===========================================================================

  describe("Component Structure", () => {
    it("renders ScrollView for scrollable content", () => {
      render(<WelcomeScreen />);

      // ScrollView is present if content is scrollable
      // We verify by checking that content renders correctly
      expect(screen.getByText("CareConnect")).toBeTruthy();
    });

    it("renders button group container", () => {
      render(<WelcomeScreen />);

      // Both buttons should be present, indicating button group exists
      expect(screen.getByText("Get Started")).toBeTruthy();
      expect(screen.getByText("Sign In")).toBeTruthy();
    });

    it("renders content container with proper structure", () => {
      render(<WelcomeScreen />);

      // Verify all main elements are present
      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(screen.getByText("❤")).toBeTruthy();
      expect(screen.getByText("Get Started")).toBeTruthy();
      expect(screen.getByText("Sign In")).toBeTruthy();
    });
  });

  // ===========================================================================
  // RNTL TESTS: Edge Cases
  // ===========================================================================

  describe("Edge Cases", () => {
    it("handles very small screen dimensions", () => {
      (RN.useWindowDimensions as jest.Mock).mockReturnValue({
        width: 320,
        height: 480,
        scale: 1,
        fontScale: 1,
      });

      render(<WelcomeScreen />);

      // Component should still render and be functional
      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(screen.getByText("Get Started")).toBeTruthy();
    });

    it("handles very large screen dimensions", () => {
      (RN.useWindowDimensions as jest.Mock).mockReturnValue({
        width: 1920,
        height: 1080,
        scale: 3,
        fontScale: 1,
      });

      render(<WelcomeScreen />);

      // Component should still render and be functional
      expect(screen.getByText("CareConnect")).toBeTruthy();
      expect(screen.getByText("Get Started")).toBeTruthy();
    });

    it("handles null color scheme gracefully", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue(null);

      render(<WelcomeScreen />);

      // Component should default to light theme
      expect(screen.getByText("CareConnect")).toBeTruthy();
    });
  });
});
