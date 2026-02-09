// =============================================================================
// USER PROVIDER TESTS
// =============================================================================
// initialRole, setUserRole, isPatient, useUser throw outside provider.
// =============================================================================

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";
import { UserProvider, useUser } from "../UserProvider";

function Consumer({ label }: { label: string }) {
  const { userRole, isPatient, setUserRole } = useUser();
  return (
    <>
      <Text testID="role">{userRole}</Text>
      <Text testID="isPatient">{String(isPatient)}</Text>
      <Text testID="label">{label}</Text>
      <Text
        testID="set-caregiver"
        onPress={() => setUserRole("caregiver")}
      >
        Set caregiver
      </Text>
      <Text
        testID="set-patient"
        onPress={() => setUserRole("patient")}
      >
        Set patient
      </Text>
    </>
  );
}

describe("UserProvider", () => {
  it("renders children", () => {
    render(
      <UserProvider>
        <Text testID="child">Child</Text>
      </UserProvider>
    );
    expect(screen.getByTestId("child").props.children).toBe("Child");
  });

  it("defaults to caregiver role", () => {
    render(
      <UserProvider>
        <Consumer label="default" />
      </UserProvider>
    );
    expect(screen.getByTestId("role").props.children).toBe("caregiver");
    expect(screen.getByTestId("isPatient").props.children).toBe("false");
  });

  it("respects initialRole caregiver", () => {
    render(
      <UserProvider initialRole="caregiver">
        <Consumer label="caregiver" />
      </UserProvider>
    );
    expect(screen.getByTestId("role").props.children).toBe("caregiver");
    expect(screen.getByTestId("isPatient").props.children).toBe("false");
  });

  it("respects initialRole patient", () => {
    render(
      <UserProvider initialRole="patient">
        <Consumer label="patient" />
      </UserProvider>
    );
    expect(screen.getByTestId("role").props.children).toBe("patient");
    expect(screen.getByTestId("isPatient").props.children).toBe("true");
  });

  it("setUserRole updates role to patient", () => {
    render(
      <UserProvider initialRole="caregiver">
        <Consumer label="x" />
      </UserProvider>
    );
    expect(screen.getByTestId("role").props.children).toBe("caregiver");
    fireEvent.press(screen.getByTestId("set-patient"));
    expect(screen.getByTestId("role").props.children).toBe("patient");
    expect(screen.getByTestId("isPatient").props.children).toBe("true");
  });

  it("setUserRole updates role to caregiver", () => {
    render(
      <UserProvider initialRole="patient">
        <Consumer label="x" />
      </UserProvider>
    );
    expect(screen.getByTestId("role").props.children).toBe("patient");
    fireEvent.press(screen.getByTestId("set-caregiver"));
    expect(screen.getByTestId("role").props.children).toBe("caregiver");
    expect(screen.getByTestId("isPatient").props.children).toBe("false");
  });
});

describe("useUser", () => {
  it("throws when used outside UserProvider", () => {
    const Bad = () => {
      useUser();
      return null;
    };
    expect(() => render(<Bad />)).toThrow("useUser must be used within UserProvider");
  });
});
