import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const R = require("react");
  const StackFn = ({ children }: { children?: React.ReactNode }) => R.createElement(R.Fragment, {}, children);
  (StackFn as { Screen?: React.FC }).Screen = () => null;
  return { Stack: StackFn };
});

import HealthLogsLayout from "../health-logs/_layout";

describe("HealthLogsLayout", () => {
  it("renders without throwing", () => {
    expect(() => render(<HealthLogsLayout />)).not.toThrow();
  });
});
