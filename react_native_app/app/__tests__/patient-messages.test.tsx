// =============================================================================
// PATIENT MESSAGES ROUTE TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

const mockBack = jest.fn();
const mockRouter = { back: mockBack, push: jest.fn(), replace: jest.fn() };
jest.mock("expo-router", () => ({ useRouter: () => mockRouter }));

const mockAlert = jest.spyOn(Alert, "alert").mockImplementation(() => {});

let mockIsPatient = true;
jest.mock("@/providers/UserProvider", () => ({
  useUser: () => ({ isPatient: mockIsPatient }),
}));

let renderedScreen: "doctor" | "patient" | null = null;
jest.mock("@/screens/MessagingThreadDoctorScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockDoctor(props: { onBack?: () => void; onCall?: () => void; onVideo?: () => void }) {
    renderedScreen = "doctor";
    return R.createElement(View, { testID: "messaging-doctor" }, [
      R.createElement(Text, { key: "t" }, "Doctor Thread"),
      R.createElement(Pressable, { key: "back", testID: "doctor-back", onPress: props.onBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "call", testID: "doctor-call", onPress: props.onCall }, R.createElement(Text, {}, "Call")),
      R.createElement(Pressable, { key: "video", testID: "doctor-video", onPress: props.onVideo }, R.createElement(Text, {}, "Video")),
    ]);
  };
});
jest.mock("@/screens/MessagingThreadPatientScreen", () => {
  const R = require("react");
  const { View, Text, Pressable } = require("react-native");
  return function MockPatient(props: { onBack?: () => void; onCall?: () => void; onVideo?: () => void }) {
    renderedScreen = "patient";
    return R.createElement(View, { testID: "messaging-patient" }, [
      R.createElement(Text, { key: "t" }, "Patient Thread"),
      R.createElement(Pressable, { key: "back", testID: "patient-back", onPress: props.onBack }, R.createElement(Text, {}, "Back")),
      R.createElement(Pressable, { key: "call", testID: "patient-call", onPress: props.onCall }, R.createElement(Text, {}, "Call")),
      R.createElement(Pressable, { key: "video", testID: "patient-video", onPress: props.onVideo }, R.createElement(Text, {}, "Video")),
    ]);
  };
});

import PatientMessagesScreen from "../patient/messages";

describe("PatientMessagesScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = null;
    mockIsPatient = true;
  });

  it("renders without throwing", () => {
    expect(() => render(<PatientMessagesScreen />)).not.toThrow();
  });

  it("renders MessagingThreadPatientScreen when user is patient", () => {
    mockIsPatient = true;
    render(<PatientMessagesScreen />);
    expect(renderedScreen).toBe("patient");
    expect(screen.getByText("Patient Thread")).toBeTruthy();
  });

  it("renders MessagingThreadDoctorScreen when user is not patient", () => {
    mockIsPatient = false;
    render(<PatientMessagesScreen />);
    expect(renderedScreen).toBe("doctor");
    expect(screen.getByText("Doctor Thread")).toBeTruthy();
  });

  it("back handler calls router.back", () => {
    mockIsPatient = true;
    render(<PatientMessagesScreen />);
    fireEvent.press(screen.getByTestId("patient-back"));
    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("call handler shows phone call alert", () => {
    mockIsPatient = true;
    render(<PatientMessagesScreen />);
    fireEvent.press(screen.getByTestId("patient-call"));
    expect(mockAlert).toHaveBeenCalledWith("Phone Call", "Coming soon.");
  });

  it("video handler shows video call alert", () => {
    mockIsPatient = false;
    render(<PatientMessagesScreen />);
    fireEvent.press(screen.getByTestId("doctor-video"));
    expect(mockAlert).toHaveBeenCalledWith("Video Call", "Coming soon.");
  });
});
