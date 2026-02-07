// =============================================================================
// CAREGIVER PATIENT MONITORING SCREEN TESTS
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

jest.mock("@/components/app-app-bar", () => ({
  AppAppBar: ({ title }: { title: string }) => {
    const { Text } = require("react-native");
    return Text({ children: title });
  },
}));

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");

import CaregiverPatientMonitoringScreen from "../monitor";

describe("CaregiverPatientMonitoringScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering - Normal Cases", () => {
    it("renders Patient Details title", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText("Patient Details")).toBeTruthy();
    });

    it("renders Patients section", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText("Patients")).toBeTruthy();
    });

    it("renders patient list", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getAllByText("Robert Williams").length).toBeGreaterThan(0);
      expect(screen.getByText("Maya Patel")).toBeTruthy();
    });

    it("renders patient IDs", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText(/Patient ID: #RW-2847/)).toBeTruthy();
      expect(screen.getByText(/Patient ID: #MP-1932/)).toBeTruthy();
    });

    it("renders patient metadata", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText(/Age 67.*Male.*Type 2 Diabetes/)).toBeTruthy();
    });

    it("renders action cards", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText("Call")).toBeTruthy();
      expect(screen.getByText("Video")).toBeTruthy();
      expect(screen.getByText("Message")).toBeTruthy();
    });

    it("renders Latest Vitals section", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByText("Latest Vitals")).toBeTruthy();
      expect(screen.getByText("Blood Pressure")).toBeTruthy();
      expect(screen.getByText("Heart Rate")).toBeTruthy();
      expect(screen.getByText("120/80")).toBeTruthy();
      expect(screen.getByText("72 bpm")).toBeTruthy();
    });
  });

  describe("User Interactions", () => {
    it("action cards are pressable", () => {
      render(<CaregiverPatientMonitoringScreen />);
      fireEvent.press(screen.getByLabelText("Call"));
      fireEvent.press(screen.getByLabelText("Video"));
      fireEvent.press(screen.getByLabelText("Message"));
      expect(screen.getByText("Call")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("action cards have accessibility labels", () => {
      render(<CaregiverPatientMonitoringScreen />);
      expect(screen.getByLabelText("Call")).toBeTruthy();
      expect(screen.getByLabelText("Video")).toBeTruthy();
      expect(screen.getByLabelText("Message")).toBeTruthy();
    });
  });
});
