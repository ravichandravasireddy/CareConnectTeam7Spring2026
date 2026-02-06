// =============================================================================
// PROVIDERS WRAPPER TESTS
// =============================================================================

import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
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
