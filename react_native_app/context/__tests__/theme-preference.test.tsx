// =============================================================================
// THEME PREFERENCE CONTEXT TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { Text, Pressable, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemePreferenceProvider, useThemePreference } from "../theme-preference";

jest.mock("@react-native-async-storage/async-storage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

// Use project's global react-native mock (__mocks__/react-native.ts); override useColorScheme in tests as needed.

function Consumer() {
  const { resolvedScheme, preference, setPreference } = useThemePreference();
  return (
    <>
      <Text testID="resolved">{resolvedScheme}</Text>
      <Text testID="preference">{preference}</Text>
      <Pressable testID="set-light" onPress={() => setPreference("light")}>
        <Text>Light</Text>
      </Pressable>
      <Pressable testID="set-dark" onPress={() => setPreference("dark")}>
        <Text>Dark</Text>
      </Pressable>
      <Pressable testID="set-system" onPress={() => setPreference("system")}>
        <Text>System</Text>
      </Pressable>
    </>
  );
}

describe("useThemePreference (outside provider)", () => {
  it("returns defaults when used outside provider", () => {
    function StandaloneConsumer() {
      const { resolvedScheme, preference } = useThemePreference();
      return (
        <>
          <Text testID="resolved">{resolvedScheme}</Text>
          <Text testID="preference">{preference}</Text>
        </>
      );
    }
    render(<StandaloneConsumer />);
    expect(screen.getByTestId("resolved").props.children).toBe("light");
    expect(screen.getByTestId("preference").props.children).toBe("system");
  });
});

describe("ThemePreferenceProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useColorScheme as jest.Mock).mockReturnValue("light");
  });

  it("renders children", () => {
    render(
      <ThemePreferenceProvider>
        <Text testID="child">Child</Text>
      </ThemePreferenceProvider>
    );
    expect(screen.getByTestId("child")).toBeTruthy();
  });

  it("provides resolvedScheme and preference to consumer", async () => {
    render(
      <ThemePreferenceProvider>
        <Consumer />
      </ThemePreferenceProvider>
    );
    expect(screen.getByTestId("resolved").props.children).toBe("light");
    expect(screen.getByTestId("preference").props.children).toBe("system");
  });

  it("setPreference(light) updates preference and persists", () => {
    render(
      <ThemePreferenceProvider>
        <Consumer />
      </ThemePreferenceProvider>
    );
    fireEvent.press(screen.getByTestId("set-light"));
    expect(screen.getByTestId("preference").props.children).toBe("light");
    expect(screen.getByTestId("resolved").props.children).toBe("light");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("careconnect.theme.preference", "light");
  });

  it("setPreference(dark) updates preference and persists", () => {
    render(
      <ThemePreferenceProvider>
        <Consumer />
      </ThemePreferenceProvider>
    );
    fireEvent.press(screen.getByTestId("set-dark"));
    expect(screen.getByTestId("preference").props.children).toBe("dark");
    expect(screen.getByTestId("resolved").props.children).toBe("dark");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("careconnect.theme.preference", "dark");
  });

  it("when preference is system, resolvedScheme follows useColorScheme", () => {
    (useColorScheme as jest.Mock).mockReturnValue("dark");
    render(
      <ThemePreferenceProvider>
        <Consumer />
      </ThemePreferenceProvider>
    );
    expect(screen.getByTestId("resolved").props.children).toBe("dark");
    expect(screen.getByTestId("preference").props.children).toBe("system");
  });
});

describe("ThemePreferenceProvider hydration", () => {
  it("loads saved preference from AsyncStorage on mount", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce("dark");
    render(
      <ThemePreferenceProvider>
        <Consumer />
      </ThemePreferenceProvider>
    );
    expect(AsyncStorage.getItem).toHaveBeenCalledWith("careconnect.theme.preference");
    await waitFor(() => {
      expect(screen.getByTestId("preference").props.children).toBe("dark");
    });
  });
});
