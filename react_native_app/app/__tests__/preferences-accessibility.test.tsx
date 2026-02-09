import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockRouter = { back: mockBack, push: jest.fn(), replace: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

let lastScreenProps: { onBack?: () => void } = {};
jest.mock("@/screens/PreferencesAccessibilityScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockPreferencesAccessibilityScreen(props: { onBack?: () => void }) {
    lastScreenProps = props;
    return R.createElement(View, { testID: "preferences-accessibility-screen" }, [
      R.createElement(Pressable, { key: "back", testID: "onBack", onPress: props.onBack }, R.createElement(Text, {}, "Back")),
    ]);
  };
});

import PreferencesAccessibilityRoute from "../preferences-accessibility";

describe("PreferencesAccessibilityRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastScreenProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<PreferencesAccessibilityRoute />)).not.toThrow();
  });

  it("renders preferences accessibility screen with onBack", () => {
    render(<PreferencesAccessibilityRoute />);
    expect(lastScreenProps.onBack).toBeDefined();
  });

  it("calls router.back when onBack is triggered", () => {
    render(<PreferencesAccessibilityRoute />);
    fireEvent.press(screen.getByTestId("onBack"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
