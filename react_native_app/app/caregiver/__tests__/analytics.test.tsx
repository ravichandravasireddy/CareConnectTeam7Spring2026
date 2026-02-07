// =============================================================================
// CAREGIVER ANALYTICS SCREEN TESTS
// =============================================================================

import React from "react";
import { render, screen } from "@testing-library/react-native";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      View({ children, ...props }),
  };
});

jest.mock("@/components/app-app-bar", () => ({
  AppAppBar: ({ title }: { title: string }) => {
    const { Text } = require("react-native");
    return Text({ children: title });
  },
}));

import CaregiverAnalyticsScreen from "../analytics";

describe("CaregiverAnalyticsScreen", () => {
  describe("Rendering - Normal Cases", () => {
    it("renders Analytics title", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText("Analytics")).toBeTruthy();
    });

    it("renders Weekly Overview header", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText("Weekly Overview")).toBeTruthy();
    });

    it("renders description text", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(
        screen.getByText("Track engagement and task completion trends.")
      ).toBeTruthy();
    });

    it("renders Task Completion metric", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText("Task Completion")).toBeTruthy();
      expect(screen.getByText("87%")).toBeTruthy();
    });

    it("renders Avg Response Time metric", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText(/Avg Response/)).toBeTruthy();
      expect(screen.getByText("12m")).toBeTruthy();
    });

    it("renders Medication Adherence section", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText("Medication Adherence")).toBeTruthy();
      expect(screen.getByText("7-day adherence trend chart")).toBeTruthy();
    });
  });

  describe("Rendering - Edge Cases", () => {
    it("renders delta text for metrics", () => {
      render(<CaregiverAnalyticsScreen />);
      expect(screen.getByText(/↑ 5% from last week/)).toBeTruthy();
      expect(screen.getByText(/↓ 3m from last week/)).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("Weekly Overview has accessibility role header", () => {
      render(<CaregiverAnalyticsScreen />);
      const header = screen.getByText("Weekly Overview");
      expect(header).toBeTruthy();
    });
  });
});
