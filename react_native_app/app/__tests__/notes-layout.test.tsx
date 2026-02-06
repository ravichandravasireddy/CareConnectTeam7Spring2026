import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const R = require("react");
  const StackFn = ({ children }: { children?: React.ReactNode }) => R.createElement(R.Fragment, {}, children);
  (StackFn as { Screen?: React.FC }).Screen = () => null;
  return { Stack: StackFn };
});

import NotesLayout from "../notes/_layout";

describe("NotesLayout", () => {
  it("renders without throwing", () => {
    expect(() => render(<NotesLayout />)).not.toThrow();
  });
});
