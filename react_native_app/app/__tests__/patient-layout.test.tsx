// =============================================================================
// PATIENT LAYOUT TESTS
// =============================================================================
// Verifies Stack + AppBottomNavBar and pathname-based bar visibility.
// =============================================================================

import React from "react";
import { render } from "@testing-library/react-native";

const mockUsePathname = jest.fn(() => "/patient");

jest.mock("expo-router", () => {
  const R = require("react");
  function StackFn({ children }: { children?: React.ReactNode }) {
    return R.createElement(R.Fragment, {}, children);
  }
  StackFn.displayName = "Stack";
  function ScreenFn() {
    return null;
  }
  ScreenFn.displayName = "Screen";
  (StackFn as { Screen?: React.ComponentType }).Screen = ScreenFn;
  return {
    Stack: StackFn,
    usePathname: () => mockUsePathname(),
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  };
});

declare global {
  var __patientLayoutNavBarCalls: unknown[];
}

jest.mock("@/components/app-bottom-nav-bar", () => {
  function MockAppBottomNavBar(props: unknown) {
    if (typeof globalThis !== "undefined") {
      (globalThis as any).__patientLayoutNavBarCalls =
        (globalThis as any).__patientLayoutNavBarCalls || [];
      (globalThis as any).__patientLayoutNavBarCalls.push(props);
    }
    return null;
  }
  MockAppBottomNavBar.displayName = "AppBottomNavBar";
  return {
  AppBottomNavBar: MockAppBottomNavBar,
  kPatientNavHome: 0,
  kPatientNavTasks: 1,
  kPatientNavMessages: 2,
  kPatientNavHealth: 3,
  kPatientNavProfile: 4,
};
});

import PatientLayout from "../patient/_layout";
import { kPatientNavHome } from "@/components/app-bottom-nav-bar";

function getLastNavBarCall(): unknown {
  const calls = (globalThis as any).__patientLayoutNavBarCalls as unknown[] | undefined;
  return calls?.length ? calls[calls.length - 1] : null;
}

describe("PatientLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).__patientLayoutNavBarCalls = [];
    mockUsePathname.mockReturnValue("/patient");
  });

  it("renders without throwing", () => {
    expect(() => render(<PatientLayout />)).not.toThrow();
  });

  it("shows bar and passes home index when pathname is /patient", () => {
    mockUsePathname.mockReturnValue("/patient");
    render(<PatientLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kPatientNavHome,
      isPatient: true,
    });
  });

  it("shows bar when pathname ends with /patient/", () => {
    mockUsePathname.mockReturnValue("/patient/");
    render(<PatientLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kPatientNavHome,
      isPatient: true,
    });
  });

  it("hides bar when pathname is /patient/messages", () => {
    mockUsePathname.mockReturnValue("/patient/messages");
    render(<PatientLayout />);
    // Bar is hidden when currentIndex is -1 (showBar false), so we get one call with -1
    const calls = (globalThis as any).__patientLayoutNavBarCalls as unknown[] | undefined;
    // When showBar is false, AppBottomNavBar is not rendered. So we should have zero nav bar calls.
    expect(calls?.length).toBe(0);
  });

  it("hides bar when pathname is /patient/profile", () => {
    mockUsePathname.mockReturnValue("/patient/profile");
    render(<PatientLayout />);
    const calls = (globalThis as any).__patientLayoutNavBarCalls as unknown[] | undefined;
    expect(calls?.length).toBe(0);
  });

  it("handles null pathname by showing bar with home index", () => {
    (mockUsePathname as jest.Mock<string | null>).mockReturnValue(null);
    render(<PatientLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kPatientNavHome,
      isPatient: true,
    });
  });
});
