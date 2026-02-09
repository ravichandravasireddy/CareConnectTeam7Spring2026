import React from "react";
import { render } from "@testing-library/react-native";

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
  (StackFn as { Screen?: React.FC }).Screen = ScreenFn;
  return { Stack: StackFn };
});

jest.mock("@/components/app-bottom-nav-bar", () => {
  const R = require("react");
  const { View } = require("react-native");
  function MockAppBottomNavBar() {
    return R.createElement(View, { testID: "app-bottom-nav-bar" });
  }
  MockAppBottomNavBar.displayName = "AppBottomNavBar";
  return {
    AppBottomNavBar: MockAppBottomNavBar,
    kCaregiverNavHome: 0,
  };
});

import HealthLogsLayout from "../health-logs/_layout";

describe("HealthLogsLayout", () => {
  it("renders without throwing", () => {
    expect(() => render(<HealthLogsLayout />)).not.toThrow();
  });
});
