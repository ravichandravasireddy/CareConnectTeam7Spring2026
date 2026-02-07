import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Note, NoteCategory } from "@/models/Note";

jest.mock("react-native", () => {
  const R = require("react");
  return {
    View: (p: unknown) => R.createElement("View", p),
    Text: (p: unknown) => R.createElement("Text", p),
    ScrollView: (p: unknown) => R.createElement("ScrollView", p),
    TouchableOpacity: (p: unknown) => R.createElement("TouchableOpacity", p),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  Stack: { Screen: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children) },
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("react-native-safe-area-context", () => {
  const R = require("react");
  const { View } = require("react-native");
  return { SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => R.createElement(View, { testID: "safe-area-view", ...p }, children) };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const R = require("react");
  const { View } = require("react-native");
  return ({ name }: { name: string }) => R.createElement(View, { testID: `icon-${name}` });
});

jest.mock("@/hooks/use-color-scheme", () => ({ useColorScheme: jest.fn(() => "light") }));

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockNotes: Note[] = [];
jest.mock("../../providers/NoteProvider", () => ({
  useNoteProvider: () => ({ notes: mockNotes, categoryColors: () => ({ bg: "#eee", fg: "#333" }) }),
}));

import NotesScreen from "../notes/index";

describe("NotesScreen", () => {
  beforeEach(() => {
    mockNotes.length = 0;
  });

  it("renders Add New Note", () => {
    render(<NotesScreen />);
    expect(screen.getByText("Add New Note")).toBeTruthy();
  });

  it("shows No notes yet when empty", () => {
    render(<NotesScreen />);
    expect(screen.getByText("No notes yet.")).toBeTruthy();
  });

  it("shows note title when notes exist", () => {
    mockNotes.push({
      id: "1",
      title: "Test Note",
      body: "B",
      author: "A",
      createdAt: new Date(2026, 1, 5, 10, 0),
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    expect(screen.getByText("Test Note")).toBeTruthy();
  });

  it("push to add when button pressed", () => {
    render(<NotesScreen />);
    fireEvent.press(screen.getByLabelText("Add New Note, button"));
    expect(mockPush).toHaveBeenCalledWith("/notes/add");
  });

  it("push to note detail when note pressed", () => {
    mockNotes.push({
      id: "1",
      title: "Test Note",
      body: "B",
      author: "A",
      createdAt: new Date(2026, 1, 5, 10, 0),
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    fireEvent.press(screen.getByText("Test Note"));
    expect(mockPush).toHaveBeenCalledWith("/notes/1");
  });

  it("formats time as Today for today's notes", () => {
    const today = new Date();
    mockNotes.push({
      id: "today-1",
      title: "Today Note",
      body: "Body",
      author: "Author",
      createdAt: today,
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    expect(screen.getByText(/Today,/)).toBeTruthy();
  });

  it("formats time as Yesterday for yesterday's notes", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    mockNotes.push({
      id: "yesterday-1",
      title: "Yesterday Note",
      body: "Body",
      author: "Author",
      createdAt: yesterday,
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    expect(screen.getByText(/Yesterday,/)).toBeTruthy();
  });

  it("formats time with date for same year notes", () => {
    const sameYear = new Date(2026, 0, 15, 14, 30);
    mockNotes.push({
      id: "same-year-1",
      title: "Same Year Note",
      body: "Body",
      author: "Author",
      createdAt: sameYear,
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    // Should show date without year
    expect(screen.getByText(/Jan 15/)).toBeTruthy();
  });

  it("formats time with full date for different year notes", () => {
    const differentYear = new Date(2025, 5, 20, 16, 45);
    mockNotes.push({
      id: "diff-year-1",
      title: "Different Year Note",
      body: "Body",
      author: "Author",
      createdAt: differentYear,
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    // Should show date with year
    expect(screen.getByText(/2025/)).toBeTruthy();
  });

  it("renders note preview truncated when body is long", () => {
    mockNotes.push({
      id: "long-1",
      title: "Long Note",
      body: "A".repeat(100),
      author: "Author",
      createdAt: new Date(2026, 1, 5, 10, 0),
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    // Preview should be truncated with ellipsis
    const preview = screen.getByText(/A{60}…/);
    expect(preview).toBeTruthy();
  });

  it("renders note preview full when body is short", () => {
    mockNotes.push({
      id: "short-1",
      title: "Short Note",
      body: "Short body",
      author: "Author",
      createdAt: new Date(2026, 1, 5, 10, 0),
      category: NoteCategory.medication,
    });
    render(<NotesScreen />);
    expect(screen.getByText("Short body")).toBeTruthy();
  });
});
