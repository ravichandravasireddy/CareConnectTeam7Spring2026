import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRouter = { back: mockBack, push: mockPush, replace: mockReplace };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

const mockSetUserRole = jest.fn();
const mockSetUserInfo = jest.fn();
jest.mock("@/providers/UserProvider", () => ({
  useUser: () => ({
    userRole: "patient",
    setUserRole: mockSetUserRole,
    setUserInfo: mockSetUserInfo,
  }),
}));

let lastProfileProps: Record<string, () => void> = {};
jest.mock("@/screens/PatientProfileScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockPatientProfileScreen(props: Record<string, () => void>) {
    lastProfileProps = props;
    return R.createElement(View, { testID: "patient-profile-screen" }, [
      R.createElement(Pressable, { key: "back", testID: "onBack", onPress: props.onBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "prefs", testID: "onPreferencesPress", onPress: props.onPreferencesPress }, R.createElement(Text, {}, "Preferences")),
      R.createElement(Pressable, { key: "signout", testID: "onSignOut", onPress: props.onSignOut }, R.createElement(Text, {}, "Sign Out")),
    ]);
  };
});

import PatientProfileScreenRoute from "../patient/profile";

describe("PatientProfileScreenRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastProfileProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<PatientProfileScreenRoute />)).not.toThrow();
  });

  it("renders profile screen with handlers", () => {
    render(<PatientProfileScreenRoute />);
    expect(lastProfileProps.onBack).toBeDefined();
    expect(lastProfileProps.onPreferencesPress).toBeDefined();
    expect(lastProfileProps.onSignOut).toBeDefined();
  });

  it("calls router.back when onBack is triggered", () => {
    render(<PatientProfileScreenRoute />);
    fireEvent.press(screen.getByTestId("onBack"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("navigates to preferences when onPreferencesPress is triggered", () => {
    render(<PatientProfileScreenRoute />);
    fireEvent.press(screen.getByTestId("onPreferencesPress"));
    expect(mockPush).toHaveBeenCalledWith("/preferences-accessibility");
  });

  it("clears user and replaces to index when onSignOut is triggered", () => {
    render(<PatientProfileScreenRoute />);
    fireEvent.press(screen.getByTestId("onSignOut"));
    expect(mockSetUserInfo).toHaveBeenCalledWith(null, null);
    expect(mockSetUserRole).toHaveBeenCalledWith("caregiver");
    expect(mockReplace).toHaveBeenCalledWith("/index");
  });
});
