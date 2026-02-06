// =============================================================================
// HEALTH TIMELINE SCREEN COMPONENT TESTS
// =============================================================================
// SWEN 661 - Verifies health timeline screen rendering and empty/populated states.
//
// KEY CONCEPTS COVERED:
// 1. Screen rendering with React Native Testing Library (RNTL)
// 2. Empty state when no timeline events
// 3. Populated timeline with event cards (title, timestamp, subtitle, status)
// 4. Theme/color scheme handling
// 5. Mocked useHealthTimelineEvents hook
// =============================================================================

import React from "react";
import { render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { TimelineEvent, TimelineEventSource } from "@/models/TimelineEvent";

// Mock react-native
jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    ScrollView: (props: unknown) => React.createElement("ScrollView", props),
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
    Platform: {
      OS: "ios",
      select: (opts: Record<string, unknown>) => opts?.default ?? opts?.ios,
    },
  };
});

// Mock expo-router
jest.mock("expo-router", () => {
  const React = require("react");
  const StackScreen = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(React.Fragment, {}, children);

  return {
    __esModule: true,
    Stack: {
      Screen: StackScreen,
    },
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

// Mock MaterialIcons
jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return jest.fn(
    ({ name, testID, ...props }: { name: string; testID?: string }) =>
      React.createElement(View, { testID: testID || `icon-${name}`, ...props }),
  );
});

// Mock use-color-scheme (health-timeline uses ../hooks/use-color-scheme)
jest.mock("@/hooks/use-color-scheme", () => ({
  useColorScheme: jest.fn(() => "light"),
}));

// Mock useHealthTimelineEvents - control timeline data per test
const mockEvents: TimelineEvent[] = [];
jest.mock("../../hooks/useHealthTimelineEvents", () => ({
  useHealthTimelineEvents: jest.fn(() => mockEvents),
}));

import HealthTimelineScreen from "../health-timeline";
import { useHealthTimelineEvents } from "../../hooks/useHealthTimelineEvents";

describe("HealthTimelineScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEvents.length = 0;
    (RN.useColorScheme as jest.Mock).mockReturnValue("light");
  });

  // ===========================================================================
  // Screen Rendering
  // ===========================================================================

  describe("Screen Rendering", () => {
    it("renders SafeAreaView", () => {
      render(<HealthTimelineScreen />);
      expect(screen.getByTestId("safe-area-view")).toBeTruthy();
    });

    it("calls useHealthTimelineEvents hook", () => {
      render(<HealthTimelineScreen />);
      expect(useHealthTimelineEvents).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Empty State
  // ===========================================================================

  describe("Empty State", () => {
    it("shows empty state message when there are no events", () => {
      render(<HealthTimelineScreen />);
      expect(
        screen.getByText(
          "No timeline events yet. Add health logs, notes, or complete tasks to see them here.",
        ),
      ).toBeTruthy();
    });

    it("shows only empty state when events are empty", () => {
      render(<HealthTimelineScreen />);
      expect(
        screen.getByText(/No timeline events yet/),
      ).toBeTruthy();
    });
  });

  // ===========================================================================
  // Populated Timeline
  // ===========================================================================

  describe("Populated Timeline", () => {
    it("renders event title when events exist", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 5, 9, 15),
        title: "Task Completed",
        subtitle: "Morning Medication",
        icon: "medication",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Task Completed")).toBeTruthy();
      expect(screen.getByText("Morning Medication")).toBeTruthy();
    });

    it("renders event with timestamp (Today format when same day)", () => {
      const today = new Date();
      mockEvents.push({
        id: "health-1",
        source: TimelineEventSource.healthLog,
        timestamp: today,
        title: "Mood",
        subtitle: "Feeling good",
        icon: "sentiment-satisfied",
        iconBackground: "#FFF3E0",
        iconColor: "#E65100",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Mood")).toBeTruthy();
      expect(screen.getByText("Feeling good")).toBeTruthy();
      // Time label contains "Today" when event is today
      const timeLabel = today.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      expect(screen.getByText(new RegExp(`Today, ${timeLabel}`))).toBeTruthy();
    });

    it("renders event with status chip when statusLabel is set", () => {
      mockEvents.push({
        id: "task-2",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 4, 14, 0),
        title: "Task Completed",
        subtitle: "Blood pressure check",
        statusLabel: "Completed",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Task Completed")).toBeTruthy();
      expect(screen.getByText("Completed")).toBeTruthy();
    });

    it("renders multiple events", () => {
      mockEvents.push(
        {
          id: "note-1",
          source: TimelineEventSource.note,
          timestamp: new Date(2026, 1, 5, 10, 0),
          title: "Note Added",
          subtitle: "Caregiver note from visit",
          icon: "description",
          iconBackground: "#F3E5F5",
          iconColor: "#7B1FA2",
        },
        {
          id: "task-1",
          source: TimelineEventSource.task,
          timestamp: new Date(2026, 1, 5, 9, 0),
          title: "Task Completed",
          subtitle: "Morning walk",
          icon: "directions-walk",
          iconBackground: "#E8F5E9",
          iconColor: "#2E7D32",
        },
      );
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Note Added")).toBeTruthy();
      expect(screen.getByText("Caregiver note from visit")).toBeTruthy();
      expect(screen.getByText("Task Completed")).toBeTruthy();
      expect(screen.getByText("Morning walk")).toBeTruthy();
    });

    it("does not show empty state message when events exist", () => {
      mockEvents.push({
        id: "health-1",
        source: TimelineEventSource.healthLog,
        timestamp: new Date(2026, 1, 5, 8, 0),
        title: "Water",
        icon: "water-drop",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
      });
      render(<HealthTimelineScreen />);
      expect(
        screen.queryByText(
          "No timeline events yet. Add health logs, notes, or complete tasks to see them here.",
        ),
      ).toBeNull();
    });

    it("renders timeline icon for event", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 5, 9, 0),
        title: "Task Completed",
        subtitle: "Medication",
        icon: "medication",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByTestId("icon-medication")).toBeTruthy();
    });

    it("renders ScrollView when events exist", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 5, 9, 0),
        title: "Task Completed",
        subtitle: "Medication",
        icon: "medication",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByTestId("health-timeline-scroll")).toBeTruthy();
    });

    it("does not render subtitle when event has no subtitle", () => {
      mockEvents.push({
        id: "health-1",
        source: TimelineEventSource.healthLog,
        timestamp: new Date(2026, 1, 5, 8, 0),
        title: "Water",
        icon: "water-drop",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Water")).toBeTruthy();
      // Subtitle is not rendered when missing; only title and timestamp appear
      expect(screen.queryByText("Morning Medication")).toBeNull();
    });

    it("does not render status chip when event has no statusLabel", () => {
      mockEvents.push({
        id: "note-1",
        source: TimelineEventSource.note,
        timestamp: new Date(2026, 1, 5, 10, 0),
        title: "Note Added",
        subtitle: "Some note",
        icon: "description",
        iconBackground: "#F3E5F5",
        iconColor: "#7B1FA2",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Note Added")).toBeTruthy();
      expect(screen.getByText("Some note")).toBeTruthy();
      expect(screen.queryByText("Completed")).toBeNull();
    });

    it("handles event when timestamp is not a Date instance (e.g. from JSON)", () => {
      // Component uses: ts = event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp)
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: "2026-01-15T14:30:00.000Z" as unknown as Date,
        title: "Task Completed",
        subtitle: "Done",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Task Completed")).toBeTruthy();
      expect(screen.getByText("Done")).toBeTruthy();
    });
  });

  // ===========================================================================
  // Timestamp Formatting (formatTimelineTimestamp branches)
  // ===========================================================================

  describe("Timestamp Formatting", () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2026, 1, 5, 12, 0, 0)); // Feb 5, 2026 noon
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("formats yesterday as Yesterday, time", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 4, 10, 30), // Feb 4, 2026 = yesterday
        title: "Task Completed",
        subtitle: "Done",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText(/Yesterday, 10:30 AM/)).toBeTruthy();
    });

    it("formats same-year date as Mon DD, time", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 0, 15, 14, 0), // Jan 15, 2026
        title: "Task Completed",
        subtitle: "Done",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText(/Jan 15, 2:00 PM/)).toBeTruthy();
    });

    it("formats different-year date with full date", () => {
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2025, 0, 10, 9, 15), // Jan 10, 2025
        title: "Task Completed",
        subtitle: "Done",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText(/Jan 10, 2025, 9:15 AM/)).toBeTruthy();
    });
  });

  // ===========================================================================
  // Theme & Color Scheme
  // ===========================================================================

  describe("Theme & Color Scheme", () => {
    it("renders with light theme when color scheme is light", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("light");
      render(<HealthTimelineScreen />);
      expect(
        screen.getByText(
          "No timeline events yet. Add health logs, notes, or complete tasks to see them here.",
        ),
      ).toBeTruthy();
    });

    it("renders with dark theme when color scheme is dark", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue("dark");
      mockEvents.push({
        id: "task-1",
        source: TimelineEventSource.task,
        timestamp: new Date(2026, 1, 5, 9, 0),
        title: "Task Completed",
        subtitle: "Test",
        icon: "check-circle",
        iconBackground: "#1B5E20",
        iconColor: "#A5D6A7",
      });
      render(<HealthTimelineScreen />);
      expect(screen.getByText("Task Completed")).toBeTruthy();
    });

    it("uses light theme when color scheme is null", () => {
      (RN.useColorScheme as jest.Mock).mockReturnValue(null);
      render(<HealthTimelineScreen />);
      expect(
        screen.getByText(
          "No timeline events yet. Add health logs, notes, or complete tasks to see them here.",
        ),
      ).toBeTruthy();
    });
  });
});
