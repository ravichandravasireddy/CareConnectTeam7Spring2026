import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = { back: mockBack, push: mockPush, replace: mockReplace };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

let lastScreenProps: Record<string, unknown> = {};
jest.mock("@/screens/SignInScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockSignInScreen(props: Record<string, unknown>) {
    lastScreenProps = props;
    const onBack = props.onNavigateBack as () => void;
    const onReg = props.onNavigateToRegistration as () => void;
    const onSuccess = props.onSignInSuccess as Function;
    return R.createElement(View, { testID: "sign-in-screen" }, [
      R.createElement(Pressable, { key: "back", testID: "onNavigateBack", onPress: onBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "reg", testID: "onNavigateToRegistration", onPress: onReg }, R.createElement(Text, {}, "Register")),
      R.createElement(Pressable, { key: "success", testID: "onSignInSuccess", onPress: () => onSuccess?.("patient") }, R.createElement(Text, {}, "Sign In")),
    ]);
  };
});

import SignInRoute from "../sign-in";

describe("SignInRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastScreenProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<SignInRoute />)).not.toThrow();
  });

  it("renders sign-in screen with handlers", () => {
    render(<SignInRoute />);
    expect(lastScreenProps.onNavigateBack).toBeDefined();
    expect(lastScreenProps.onNavigateToRegistration).toBeDefined();
    expect(lastScreenProps.onSignInSuccess).toBeDefined();
  });

  it("calls router.back when onNavigateBack is triggered", () => {
    render(<SignInRoute />);
    fireEvent.press(screen.getByTestId("onNavigateBack"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("navigates to role-selection when onNavigateToRegistration is triggered", () => {
    render(<SignInRoute />);
    fireEvent.press(screen.getByTestId("onNavigateToRegistration"));
    expect(mockPush).toHaveBeenCalledWith("/role-selection");
  });

  it("replaces to /patient when onSignInSuccess is called with patient", () => {
    render(<SignInRoute />);
    fireEvent.press(screen.getByTestId("onSignInSuccess"));
    expect(mockReplace).toHaveBeenCalledWith("/patient");
  });

  it("replaces to /caregiver when onSignInSuccess is called with caregiver", () => {
    render(<SignInRoute />);
    const onSuccess = lastScreenProps.onSignInSuccess as (role: string) => void;
    onSuccess("caregiver");
    expect(mockReplace).toHaveBeenCalledWith("/caregiver");
  });
});
