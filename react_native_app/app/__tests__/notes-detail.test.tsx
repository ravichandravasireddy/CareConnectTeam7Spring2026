// Note detail screen ([id]) tests
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { NoteCategory } from "@/models/Note";

jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (p: unknown) => React.createElement("View", p),
    Text: (p: unknown) => React.createElement("Text", p),
    ScrollView: (p: unknown) => React.createElement("ScrollView", p),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

jest.mock("expo-router", () => ({
  Stack: { Screen: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children) },
  useLocalSearchParams: jest.fn(() => ({ id: "1" })),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => React.createElement(View, { testID: "safe-area-view", ...p }, children) };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return () => React.createElement(View, { testID: "icon-description" });
});

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockGetById = jest.fn();
jest.mock("../../providers/NoteProvider", () => ({
  useNoteProvider: () => ({ getById: mockGetById, categoryColors: () => ({ bg: "#E3F2FD", fg: "#1976D2" }) }),
}));

import NoteDetailScreen from "../notes/[id]";

describe("NoteDetailScreen", () => {
  beforeEach(() => {
    (require("expo-router").useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  it("shows Note not found when getById returns undefined", () => {
    mockGetById.mockReturnValue(undefined);
    render(<NoteDetailScreen />);
    expect(screen.getByText("Note not found")).toBeTruthy();
  });

  it("shows note content when note found", () => {
    mockGetById.mockReturnValue({
      id: "1",
      title: "My Note",
      body: "Note body",
      author: "Robert",
      createdAt: new Date(2026, 1, 5, 10, 30),
      category: NoteCategory.medication,
    });
    render(<NoteDetailScreen />);
    expect(screen.getByText("Note body")).toBeTruthy();
    expect(screen.getByText("Robert")).toBeTruthy();
    expect(screen.getByText("MEDICATION")).toBeTruthy();
    expect(screen.queryByText("Note not found")).toBeNull();
  });
});
