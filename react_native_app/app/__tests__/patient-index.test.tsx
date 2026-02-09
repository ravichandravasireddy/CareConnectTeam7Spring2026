import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockPush = jest.fn();
const mockRouter = { back: jest.fn(), push: mockPush, replace: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

let lastMenuProps: { visible?: boolean; onClose?: () => void } = {};
jest.mock("@/components/app-menu", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return {
    AppMenu: (props: { visible?: boolean; onClose?: () => void }) => {
      lastMenuProps = props;
      return R.createElement(View, { testID: "app-menu" }, [
        props.visible
          ? R.createElement(Pressable, { key: "c", testID: "menu-close", onPress: props.onClose }, R.createElement(Text, {}, "Close"))
          : null,
      ]);
    },
  };
});

let lastDashboardProps: Record<string, unknown> = {};
jest.mock("@/screens/PatientDashboardScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockPatientDashboardScreen(props: Record<string, unknown>) {
    lastDashboardProps = props;
    const onCal = props.onCalendarPress as () => void;
    const onMenu = props.onMenuPress as () => void;
    const onMsg = props.onMessagingPress as () => void;
    return R.createElement(View, { testID: "patient-dashboard" }, [
      R.createElement(Text, { key: "t" }, "Patient Dashboard"),
      R.createElement(Pressable, { key: "cal", testID: "onCalendarPress", onPress: onCal }, R.createElement(Text, {}, "Calendar")),
      R.createElement(Pressable, { key: "m", testID: "onMenuPress", onPress: onMenu }, R.createElement(Text, {}, "Menu")),
      R.createElement(Pressable, { key: "msg", testID: "onMessagingPress", onPress: onMsg }, R.createElement(Text, {}, "Messages")),
    ]);
  };
});

import PatientHomeScreen from "../patient/index";

describe("PatientHomeScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lastMenuProps = {};
    lastDashboardProps = {};
  });

  it("renders without throwing", () => {
    expect(() => render(<PatientHomeScreen />)).not.toThrow();
  });

  it("renders dashboard with userName and handlers", () => {
    render(<PatientHomeScreen />);
    expect(screen.getByText("Patient Dashboard")).toBeTruthy();
    expect(lastDashboardProps.userName).toBe("Robert Williams");
  });

  it("opens menu when onMenuPress is triggered", () => {
    render(<PatientHomeScreen />);
    expect(lastMenuProps.visible).toBe(false);
    fireEvent.press(screen.getByTestId("onMenuPress"));
    expect(lastMenuProps.visible).toBe(true);
  });

  it("navigates to calendar when onCalendarPress is triggered", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onCalendarPress"));
    expect(mockPush).toHaveBeenCalledWith("/calendar");
  });

  it("navigates to patient messages when onMessagingPress is triggered", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onMessagingPress"));
    expect(mockPush).toHaveBeenCalledWith("/patient/messages");
  });
});
