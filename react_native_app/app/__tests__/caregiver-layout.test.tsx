// =============================================================================
// CAREGIVER LAYOUT TESTS
// =============================================================================
// Verifies Stack + AppBottomNavBar behavior and pathname-based bar visibility.
// =============================================================================

import React from "react";
import { render } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockUsePathname = jest.fn(() => "/caregiver");

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
    useRouter: () => ({ push: mockPush, replace: jest.fn(), back: jest.fn() }),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
    SafeAreaView: View,
  };
});

declare global {
  var __caregiverLayoutNavBarCalls: unknown[];
}

jest.mock("@/components/app-bottom-nav-bar", () => {
  function MockAppBottomNavBar(props: unknown) {
    if (typeof globalThis !== "undefined") {
      (globalThis as any).__caregiverLayoutNavBarCalls =
        (globalThis as any).__caregiverLayoutNavBarCalls || [];
      (globalThis as any).__caregiverLayoutNavBarCalls.push(props);
    }
    return null;
  }
  MockAppBottomNavBar.displayName = "AppBottomNavBar";
  return {
  AppBottomNavBar: MockAppBottomNavBar,
  kCaregiverNavHome: 0,
  kCaregiverNavTasks: 1,
  kCaregiverNavAnalytics: 2,
  kCaregiverNavMonitor: 3,
};
});

import CaregiverLayout from "../caregiver/_layout";
import {
  kCaregiverNavHome,
  kCaregiverNavTasks,
  kCaregiverNavAnalytics,
  kCaregiverNavMonitor,
} from "@/components/app-bottom-nav-bar";

function getLastNavBarCall(): unknown {
  const calls = (globalThis as any).__caregiverLayoutNavBarCalls as unknown[] | undefined;
  return calls?.length ? calls[calls.length - 1] : null;
}

describe("CaregiverLayout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis as any).__caregiverLayoutNavBarCalls = [];
    mockUsePathname.mockReturnValue("/caregiver");
  });

  it("renders without throwing", () => {
    expect(() => render(<CaregiverLayout />)).not.toThrow();
  });

  it("shows bar and passes home index when pathname is /caregiver", () => {
    mockUsePathname.mockReturnValue("/caregiver");
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kCaregiverNavHome,
      isPatient: false,
    });
  });

  it("shows bar and passes home index when pathname ends with /caregiver/", () => {
    mockUsePathname.mockReturnValue("/caregiver/");
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({ currentIndex: kCaregiverNavHome, isPatient: false });
  });

  it("shows bar with tasks index when pathname is /caregiver/tasks", () => {
    mockUsePathname.mockReturnValue("/caregiver/tasks");
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({ currentIndex: kCaregiverNavTasks, isPatient: false });
  });

  it("shows bar with analytics index when pathname is /caregiver/analytics", () => {
    mockUsePathname.mockReturnValue("/caregiver/analytics");
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kCaregiverNavAnalytics,
      isPatient: false,
    });
  });

  it("shows bar with monitor index when pathname is /caregiver/monitor", () => {
    mockUsePathname.mockReturnValue("/caregiver/monitor");
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({
      currentIndex: kCaregiverNavMonitor,
      isPatient: false,
    });
  });


  it("handles null pathname by showing bar with home index", () => {
    (mockUsePathname as jest.Mock<string | null>).mockReturnValue(null);
    render(<CaregiverLayout />);
    expect(getLastNavBarCall()).toMatchObject({ currentIndex: kCaregiverNavHome, isPatient: false });
  });
});
