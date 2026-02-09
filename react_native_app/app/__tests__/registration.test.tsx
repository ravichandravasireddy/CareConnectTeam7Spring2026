import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = { back: mockBack, push: mockPush, replace: mockReplace };
const mockUseLocalSearchParams = jest.fn(() => ({ role: "patient" }));
jest.mock("expo-router", () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

let lastScreenProps: Record<string, unknown> = {};
jest.mock("@/screens/RegistrationScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockRegistrationScreen(props: Record<string, unknown>) {
    lastScreenProps = props;
    const onBack = props.onNavigateBack as () => void;
    const onSignIn = props.onNavigateToSignIn as () => void;
    const onSuccess = props.onRegistrationSuccess as Function;
    return R.createElement(View, { testID: "registration-screen" }, [
      R.createElement(Pressable, { key: "back", testID: "onNavigateBack", onPress: onBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "signin", testID: "onNavigateToSignIn", onPress: onSignIn }, R.createElement(Text, {}, "Sign In")),
      R.createElement(Pressable, { key: "success", testID: "onRegistrationSuccess", onPress: () => onSuccess?.("patient") }, R.createElement(Text, {}, "Submit")),
    ]);
  };
});

import RegistrationRoute from "../registration";

describe("RegistrationRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocalSearchParams.mockReturnValue({ role: "patient" });
    lastScreenProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<RegistrationRoute />)).not.toThrow();
  });

  it("passes selectedRole from params (patient when role is patient)", () => {
    mockUseLocalSearchParams.mockReturnValue({ role: "patient" });
    render(<RegistrationRoute />);
    expect(lastScreenProps.selectedRole).toBe("patient");
  });

  it("passes selectedRole caregiver when role param is caregiver", () => {
    mockUseLocalSearchParams.mockReturnValue({ role: "caregiver" });
    render(<RegistrationRoute />);
    expect(lastScreenProps.selectedRole).toBe("caregiver");
  });

  it("calls router.back when onNavigateBack is triggered", () => {
    render(<RegistrationRoute />);
    fireEvent.press(screen.getByTestId("onNavigateBack"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("navigates to sign-in when onNavigateToSignIn is triggered", () => {
    render(<RegistrationRoute />);
    fireEvent.press(screen.getByTestId("onNavigateToSignIn"));
    expect(mockPush).toHaveBeenCalledWith("/sign-in");
  });

  it("replaces to /patient when onRegistrationSuccess is called with patient", () => {
    render(<RegistrationRoute />);
    fireEvent.press(screen.getByTestId("onRegistrationSuccess"));
    expect(mockReplace).toHaveBeenCalledWith("/patient");
  });

  it("replaces to /caregiver when onRegistrationSuccess is called with caregiver", () => {
    mockUseLocalSearchParams.mockReturnValue({ role: "caregiver" });
    render(<RegistrationRoute />);
    const onSuccess = lastScreenProps.onRegistrationSuccess as (role: string) => void;
    onSuccess("caregiver");
    expect(mockReplace).toHaveBeenCalledWith("/caregiver");
  });
});
