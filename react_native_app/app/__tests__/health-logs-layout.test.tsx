import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const R = require("react");
  const StackFn = ({ children }: { children?: React.ReactNode }) => R.createElement(R.Fragment, {}, children);
  (StackFn as { Screen?: React.FC }).Screen = () => null;
  return { Stack: StackFn };
});

jest.mock("@/components/app-bottom-nav-bar", () => {
  const R = require("react");
  const { View } = require("react-native");
  return {
    AppBottomNavBar: () => R.createElement(View, { testID: "app-bottom-nav-bar" }),
    kCaregiverNavHome: 0,
  };
});

import HealthLogsLayout from "../health-logs/_layout";

describe("HealthLogsLayout", () => {
  it("renders without throwing", () => {
    expect(() => render(<HealthLogsLayout />)).not.toThrow();
  });
});
