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
    const onNotif = props.onNotificationsPress as () => void;
    const onCal = props.onCalendarPress as () => void;
    const onMenu = props.onMenuPress as () => void;
    const onMsg = props.onMessagingPress as () => void;
    const onHealth = props.onHealthLogsPress as () => void;
    const onTask = props.onTaskDetailsPress as (...args: unknown[]) => void;
    const onVideo = props.onVideoCallPress as () => void;
    const onEmerg = props.onEmergencyPress as () => void;
    return R.createElement(View, { testID: "patient-dashboard" }, [
      R.createElement(Text, { key: "t" }, "Patient Dashboard"),
      R.createElement(Pressable, { key: "n", testID: "onNotificationsPress", onPress: onNotif }, R.createElement(Text, {}, "Notifications")),
      R.createElement(Pressable, { key: "cal", testID: "onCalendarPress", onPress: onCal }, R.createElement(Text, {}, "Calendar")),
      R.createElement(Pressable, { key: "m", testID: "onMenuPress", onPress: onMenu }, R.createElement(Text, {}, "Menu")),
      R.createElement(Pressable, { key: "msg", testID: "onMessagingPress", onPress: onMsg }, R.createElement(Text, {}, "Messages")),
      R.createElement(Pressable, { key: "h", testID: "onHealthLogsPress", onPress: onHealth }, R.createElement(Text, {}, "Health Logs")),
      R.createElement(Pressable, { key: "td", testID: "onTaskDetailsPress", onPress: () => onTask("tid-1") }, R.createElement(Text, {}, "Task")),
      R.createElement(Pressable, { key: "v", testID: "onVideoCallPress", onPress: onVideo }, R.createElement(Text, {}, "Video")),
      R.createElement(Pressable, { key: "e", testID: "onEmergencyPress", onPress: onEmerg }, R.createElement(Text, {}, "Emergency")),
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

  it("navigates to notifications from dashboard handler", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onNotificationsPress"));
    expect(mockPush).toHaveBeenCalledWith("/notifications");
  });

  it("navigates to health logs from dashboard handler", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onHealthLogsPress"));
    expect(mockPush).toHaveBeenCalledWith("/health-logs");
  });

  it("navigates to task details with params from dashboard handler", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onTaskDetailsPress"));
    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/task-details",
      params: { taskId: "tid-1" },
    });
  });

  it("navigates to video call from dashboard handler", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onVideoCallPress"));
    expect(mockPush).toHaveBeenCalledWith("/video-call");
  });

  it("navigates to emergency SOS from dashboard handler", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onEmergencyPress"));
    expect(mockPush).toHaveBeenCalledWith("/emergency-sos");
  });

  it("closes menu when AppMenu invokes onClose", () => {
    render(<PatientHomeScreen />);
    fireEvent.press(screen.getByTestId("onMenuPress"));
    expect(lastMenuProps.visible).toBe(true);
    fireEvent.press(screen.getByTestId("menu-close"));
    expect(lastMenuProps.visible).toBe(false);
  });
});
