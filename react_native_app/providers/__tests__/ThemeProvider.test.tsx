// =============================================================================
// THEME PROVIDER TESTS
// =============================================================================
// useTheme context, colorScheme/themeKey resolution, highContrast toggle.
// =============================================================================

import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { ThemeProvider, useTheme } from "../ThemeProvider";
import { Colors } from "@/constants/theme";

jest.mock("react-native", () => {
  const R = require("react");
  const useColorSchemeMock = jest.fn<"light" | "dark" | "highContrast" | null, []>(() => "light");
  return {
    View: (p: unknown) => R.createElement("View", p),
    Text: (p: unknown) => R.createElement("Text", p),
    TouchableOpacity: (p: unknown) => R.createElement("TouchableOpacity", p),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: useColorSchemeMock,
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const getUseColorSchemeMock = () =>
  (require("react-native") as { useColorScheme: jest.Mock }).useColorScheme;

function Consumer() {
  const { colorScheme, highContrast, setHighContrast, colors, themeKey } =
    useTheme();
  return (
    <View>
      <Text testID="colorScheme">{colorScheme}</Text>
      <Text testID="highContrast">{highContrast ? "true" : "false"}</Text>
      <Text testID="themeKey">{themeKey}</Text>
      <Text testID="background">{colors.background}</Text>
      <Text testID="text">{colors.text}</Text>
      <TouchableOpacity
        testID="toggle"
        onPress={() => setHighContrast(!highContrast)}
      >
        <Text>Toggle</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    getUseColorSchemeMock().mockReturnValue("light");
  });

  describe("useTheme", () => {
    it("throws when used outside ThemeProvider", () => {
      expect(() => render(<Consumer />)).toThrow(
        "useTheme must be used within ThemeProvider"
      );
    });

    it("provides context when wrapped in ThemeProvider", () => {
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("colorScheme").props.children).toBe("light");
      expect(screen.getByTestId("themeKey").props.children).toBe("light");
    });
  });

  describe("colorScheme and themeKey from system", () => {
    it("resolves to light when useColorScheme returns light", () => {
      getUseColorSchemeMock().mockReturnValue("light");
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("colorScheme").props.children).toBe("light");
      expect(screen.getByTestId("themeKey").props.children).toBe("light");
      expect(screen.getByTestId("background").props.children).toBe(
        Colors.light.background
      );
    });

    it("resolves to dark when useColorScheme returns dark", () => {
      getUseColorSchemeMock().mockReturnValue("dark");
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("colorScheme").props.children).toBe("dark");
      expect(screen.getByTestId("themeKey").props.children).toBe("dark");
      expect(screen.getByTestId("background").props.children).toBe(
        Colors.dark.background
      );
    });

    it("falls back to light when useColorScheme returns null", () => {
      getUseColorSchemeMock().mockReturnValue(null);
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("colorScheme").props.children).toBe("light");
      expect(screen.getByTestId("themeKey").props.children).toBe("light");
    });
  });

  describe("highContrast", () => {
    it("defaults to false", () => {
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("highContrast").props.children).toBe("false");
      expect(screen.getByTestId("themeKey").props.children).toBe("light");
    });

    it("uses initialHighContrast when provided", () => {
      render(
        <ThemeProvider initialHighContrast={true}>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("highContrast").props.children).toBe("true");
      expect(screen.getByTestId("themeKey").props.children).toBe(
        "highContrastLight"
      );
      expect(screen.getByTestId("background").props.children).toBe(
        Colors.highContrastLight.background
      );
    });

    it("setHighContrast toggles high contrast and updates themeKey/colors", () => {
      render(
        <ThemeProvider>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("themeKey").props.children).toBe("light");

      act(() => {
        fireEvent.press(screen.getByTestId("toggle"));
      });
      expect(screen.getByTestId("highContrast").props.children).toBe("true");
      expect(screen.getByTestId("themeKey").props.children).toBe(
        "highContrastLight"
      );
      expect(screen.getByTestId("background").props.children).toBe(
        Colors.highContrastLight.background
      );

      act(() => {
        fireEvent.press(screen.getByTestId("toggle"));
      });
      expect(screen.getByTestId("highContrast").props.children).toBe("false");
      expect(screen.getByTestId("themeKey").props.children).toBe("light");
    });

    it("resolves highContrastDark when dark system + high contrast", () => {
      getUseColorSchemeMock().mockReturnValue("dark");
      render(
        <ThemeProvider initialHighContrast={true}>
          <Consumer />
        </ThemeProvider>
      );
      expect(screen.getByTestId("themeKey").props.children).toBe(
        "highContrastDark"
      );
      expect(screen.getByTestId("background").props.children).toBe(
        Colors.highContrastDark.background
      );
    });
  });
});
