// =============================================================================
// PROVIDERS WRAPPER TESTS
// =============================================================================

import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

import { Providers } from "../Providers";

describe("Providers", () => {
  it("renders children", () => {
    render(
      <Providers>
        <Text testID="child">Child</Text>
      </Providers>
    );
    expect(screen.getByTestId("child").props.children).toBe("Child");
  });
});
