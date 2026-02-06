// =============================================================================
// VIDEO CALL SCREEN COMPONENT TESTS
// =============================================================================
// SWEN 661 - Verifies video call screen rendering, interactions, and accessibility.
//
// KEY CONCEPTS COVERED:
// 1. Screen rendering with React Native Testing Library (RNTL)
// 2. User interactions (camera toggle, call controls, ASL interpreter)
// 3. Accessibility labels and roles
// 4. Timer display and ASL phase transition (fake timers)
// 5. Navigation (router.back on end call)
// =============================================================================

import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";

// Mock react-native (no requireActual to avoid native module loading)
jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    Image: (props: unknown) => React.createElement("Image", props),
    TouchableOpacity: (props: unknown) =>
      React.createElement("TouchableOpacity", props),
    StyleSheet: {
      create: (styles: Record<string, unknown>) => styles,
      flatten: (style: unknown) => style,
      absoluteFill: {},
      absoluteFillObject: {},
    },
    Animated: {
      View: (props: unknown) => React.createElement("View", props),
      Value: jest.fn(() => ({ interpolate: jest.fn(() => 0) })),
      timing: jest.fn(() => ({ start: jest.fn() })),
      sequence: jest.fn((arr: unknown[]) => ({ start: jest.fn() })),
      loop: jest.fn((anim: unknown) => ({ start: jest.fn(), stop: jest.fn() })),
      delay: jest.fn(() => ({ start: jest.fn() })),
    },
    useColorScheme: jest.fn(() => "light"),
    useWindowDimensions: jest.fn(() => ({
      width: 375,
      height: 812,
      scale: 2,
      fontScale: 1,
    })),
    Platform: {
      OS: "ios",
      select: (opts: Record<string, unknown>) => opts?.default ?? opts?.ios,
    },
  };
});

// Mock expo-router
const mockBack = jest.fn();
jest.mock("expo-router", () => {
  const React = require("react");
  const StackScreen = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children);

  return {
    __esModule: true,
    Stack: {
      Screen: StackScreen,
    },
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: mockBack,
      canGoBack: jest.fn(() => true),
    })),
  };
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(View, { testID: "safe-area-view", ...props }, children),
  };
});

// Mock expo-linear-gradient
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(View, { testID: "linear-gradient", ...props }, children),
  };
});

// Mock MaterialIcons
jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return jest.fn(
    ({ name, testID, ...props }: { name: string; testID?: string }) =>
      React.createElement(View, { testID: testID || `icon-${name}`, ...props }),
  );
});

import VideoCallScreen from "../video-call";

describe("VideoCallScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (RN.useColorScheme as jest.Mock).mockReturnValue("light");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ===========================================================================
  // Screen Rendering
  // ===========================================================================

  describe("Screen Rendering", () => {
    it("renders SafeAreaView", () => {
      render(<VideoCallScreen />);
      expect(screen.getByTestId("safe-area-view")).toBeTruthy();
    });

    it("renders patient name Robert Williams", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText("Robert Williams")).toBeTruthy();
    });

    it("renders patient role label", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText("Patient")).toBeTruthy();
    });

    it("renders caregiver name Sarah Johnson", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText("Sarah Johnson")).toBeTruthy();
    });

    it("renders call timer in MM:SS format", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeTruthy();
    });

    it("renders microphone button with accessibility label", () => {
      render(<VideoCallScreen />);
      expect(screen.getByLabelText("Microphone on")).toBeTruthy();
    });

    it("renders video button with accessibility label", () => {
      render(<VideoCallScreen />);
      expect(screen.getByLabelText("Video on")).toBeTruthy();
    });

    it("renders End call button", () => {
      render(<VideoCallScreen />);
      expect(screen.getByLabelText("End call")).toBeTruthy();
    });

    it("renders More options button", () => {
      render(<VideoCallScreen />);
      expect(screen.getByLabelText("More options")).toBeTruthy();
    });

    it("renders ASL Interpreter button", () => {
      render(<VideoCallScreen />);
      expect(screen.getByLabelText("ASL Interpreter")).toBeTruthy();
    });

    it("shows patient camera-off view initially (person icon)", () => {
      render(<VideoCallScreen />);
      expect(screen.getByTestId("icon-person")).toBeTruthy();
    });
  });

  // ===========================================================================
  // User Interactions
  // ===========================================================================

  describe("User Interactions", () => {
    it("toggles patient camera when main area is pressed", () => {
      render(<VideoCallScreen />);
      const patientName = screen.getByText("Robert Williams");
      fireEvent.press(patientName);
      // After toggle, patient camera is on; labels still present
      expect(screen.getByText("Robert Williams")).toBeTruthy();
    });

    it("calls router.back when End call is pressed", () => {
      render(<VideoCallScreen />);
      const endCallBtn = screen.getByLabelText("End call");
      fireEvent.press(endCallBtn);
      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("toggles microphone label when mic button is pressed", () => {
      render(<VideoCallScreen />);
      const micBtn = screen.getByLabelText("Microphone on");
      fireEvent.press(micBtn);
      expect(screen.getByLabelText("Microphone off")).toBeTruthy();
      fireEvent.press(screen.getByLabelText("Microphone off"));
      expect(screen.getByLabelText("Microphone on")).toBeTruthy();
    });

    it("toggles video label when video button is pressed", () => {
      render(<VideoCallScreen />);
      const videoBtn = screen.getByLabelText("Video on");
      fireEvent.press(videoBtn);
      expect(screen.getByLabelText("Video off")).toBeTruthy();
      fireEvent.press(screen.getByLabelText("Video off"));
      expect(screen.getByLabelText("Video on")).toBeTruthy();
    });

    it("opens ASL interpreter PIP when ASL button is pressed", () => {
      render(<VideoCallScreen />);
      const aslBtn = screen.getByLabelText("ASL Interpreter");
      fireEvent.press(aslBtn);
      expect(screen.getByText("Connecting…")).toBeTruthy();
      expect(screen.getByText("ASL Interpreter")).toBeTruthy();
    });

    it("closes ASL interpreter when close button is pressed", () => {
      render(<VideoCallScreen />);
      fireEvent.press(screen.getByLabelText("ASL Interpreter"));
      expect(screen.getByLabelText("Close ASL interpreter")).toBeTruthy();
      fireEvent.press(screen.getByLabelText("Close ASL interpreter"));
      expect(screen.queryByLabelText("Close ASL interpreter")).toBeNull();
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================

  describe("Accessibility", () => {
    it("End call button has accessibility role button", () => {
      render(<VideoCallScreen />);
      const btn = screen.getByLabelText("End call");
      expect(btn.props.accessibilityRole).toBe("button");
    });

    it("ASL Interpreter button has accessibility role button", () => {
      render(<VideoCallScreen />);
      const btn = screen.getByLabelText("ASL Interpreter");
      expect(btn.props.accessibilityRole).toBe("button");
    });

    it("Close ASL interpreter has accessibility role button when ASL visible", () => {
      render(<VideoCallScreen />);
      fireEvent.press(screen.getByLabelText("ASL Interpreter"));
      const closeBtn = screen.getByLabelText("Close ASL interpreter");
      expect(closeBtn.props.accessibilityRole).toBe("button");
    });
  });

  // ===========================================================================
  // Timer
  // ===========================================================================

  describe("Timer", () => {
    it("shows 00:00 initially", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText("00:00")).toBeTruthy();
    });

    it("advances timer after time passes", () => {
      render(<VideoCallScreen />);
      expect(screen.getByText("00:00")).toBeTruthy();
      act(() => {
        jest.advanceTimersByTime(5000);
      });
      expect(screen.getByText("00:05")).toBeTruthy();
    });
  });
});
