import React from "react";
import { render } from "@testing-library/react-native";

jest.mock("expo-router", () => {
  const R = require("react");
  const StackFn = ({ children }: { children?: React.ReactNode }) => R.createElement(R.Fragment, {}, children);
  (StackFn as { Screen?: React.FC }).Screen = () => null;
  return {
    Stack: StackFn,
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  };
});

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    useSafeAreaInsets: () => ({ bottom: 0, top: 0, left: 0, right: 0 }),
    SafeAreaView: View,
  };
});

jest.mock("@/components/app-bottom-nav-bar", () => {
  const R = require("react");
  const { View } = require("react-native");
  return {
    AppBottomNavBar: () => R.createElement(View, { testID: "app-bottom-nav-bar" }),
    kCaregiverNavHome: 0,
  };
});

import { UserProvider } from "@/providers/UserProvider";
import NotesLayout from "../notes/_layout";

describe("NotesLayout", () => {
  it("renders without throwing", () => {
    expect(() =>
      render(
        <UserProvider initialRole="caregiver">
          <NotesLayout />
        </UserProvider>
      )
    ).not.toThrow();
  });
});
