import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockRouter = { back: mockBack, push: mockPush, replace: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

let lastScreenProps: { onNavigateBack?: () => void; onSelectRole?: (role: string) => void } = {};
jest.mock("@/screens/RoleSelectionScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockRoleSelectionScreen(props: typeof lastScreenProps) {
    lastScreenProps = props;
    return R.createElement(View, { testID: "role-selection-screen" }, [
      R.createElement(Pressable, { key: "back", testID: "onNavigateBack", onPress: props.onNavigateBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "patient", testID: "select-patient", onPress: () => props.onSelectRole?.("patient") }, R.createElement(Text, {}, "Patient")),
      R.createElement(Pressable, { key: "caregiver", testID: "select-caregiver", onPress: () => props.onSelectRole?.("caregiver") }, R.createElement(Text, {}, "Caregiver")),
    ]);
  };
});

import RoleSelectionRoute from "../role-selection";

describe("RoleSelectionRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastScreenProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<RoleSelectionRoute />)).not.toThrow();
  });

  it("renders role selection screen with handlers", () => {
    render(<RoleSelectionRoute />);
    expect(lastScreenProps.onNavigateBack).toBeDefined();
    expect(lastScreenProps.onSelectRole).toBeDefined();
  });

  it("calls router.back when onNavigateBack is triggered", () => {
    render(<RoleSelectionRoute />);
    fireEvent.press(screen.getByTestId("onNavigateBack"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("navigates to registration with role param when patient is selected", () => {
    render(<RoleSelectionRoute />);
    fireEvent.press(screen.getByTestId("select-patient"));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/registration", params: { role: "patient" } });
  });

  it("navigates to registration with role param when caregiver is selected", () => {
    render(<RoleSelectionRoute />);
    fireEvent.press(screen.getByTestId("select-caregiver"));
    expect(mockPush).toHaveBeenCalledWith({ pathname: "/registration", params: { role: "caregiver" } });
  });
});
