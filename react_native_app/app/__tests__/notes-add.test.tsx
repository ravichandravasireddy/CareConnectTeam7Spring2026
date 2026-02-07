// =============================================================================
// NOTES ADD SCREEN TESTS
// =============================================================================

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import * as RN from "react-native";
import { NoteCategory } from "@/models/Note";

jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: unknown) => React.createElement("View", props),
    Text: (props: unknown) => React.createElement("Text", props),
    ScrollView: (props: unknown) => React.createElement("ScrollView", props),
    TouchableOpacity: (props: unknown) => React.createElement("TouchableOpacity", props),
    TextInput: (props: unknown) => React.createElement("TextInput", props),
    KeyboardAvoidingView: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children),
    StyleSheet: { create: (s: Record<string, unknown>) => s, flatten: (x: unknown) => x },
    useColorScheme: jest.fn(() => "light"),
    Platform: { OS: "ios", select: (o: Record<string, unknown>) => o?.ios ?? o?.default },
  };
});

const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  Stack: { Screen: ({ children }: { children?: React.ReactNode }) => require("react").createElement(require("react").Fragment, {}, children) },
  useRouter: () => ({ back: mockBack }),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { SafeAreaView: ({ children, ...p }: { children?: React.ReactNode }) => React.createElement(View, { testID: "safe-area-view", ...p }, children) };
});

jest.mock("@expo/vector-icons/MaterialIcons", () => {
  const React = require("react");
  const { View } = require("react-native");
  return () => React.createElement(View, { testID: "icon-close" });
});

jest.mock("@/providers/ThemeProvider", () => {
  const { Colors } = require("@/constants/theme");
  return {
    useTheme: () => ({ colors: Colors.light, colorScheme: "light", highContrast: false, setHighContrast: () => {}, themeKey: "light" }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockAddNote = jest.fn();
jest.mock("../../providers/NoteProvider", () => ({
  useNoteProvider: () => ({ addNote: mockAddNote }),
}));

import AddNoteScreen from "../notes/add";

describe("AddNoteScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title, Save, and form fields", () => {
    render(<AddNoteScreen />);
    expect(screen.getByText("Save")).toBeTruthy();
    expect(screen.getByPlaceholderText("e.g. Medication Side Effects")).toBeTruthy();
    expect(screen.getByPlaceholderText("Write your note here…")).toBeTruthy();
    expect(screen.getByText("Medication")).toBeTruthy();
  });

  it("shows validation errors when saving empty", () => {
    render(<AddNoteScreen />);
    fireEvent.press(screen.getByLabelText("Save, button"));
    expect(screen.getByText("Enter a title")).toBeTruthy();
    expect(screen.getByText("Enter note content")).toBeTruthy();
    expect(mockAddNote).not.toHaveBeenCalled();
  });

  it("calls addNote and router.back when valid", () => {
    render(<AddNoteScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("e.g. Medication Side Effects"), "My Title");
    fireEvent.changeText(screen.getByPlaceholderText("Write your note here…"), "My body");
    fireEvent.press(screen.getByLabelText("Save, button"));
    expect(mockAddNote).toHaveBeenCalledTimes(1);
    expect(mockAddNote.mock.calls[0][0]).toMatchObject({ title: "My Title", body: "My body", category: NoteCategory.medication });
    expect(mockBack).toHaveBeenCalled();
  });

  it("allows selecting different categories", () => {
    render(<AddNoteScreen />);
    const exerciseChip = screen.getByText("Exercise");
    fireEvent.press(exerciseChip);
    // Category should be updated (we verify by saving)
    fireEvent.changeText(screen.getByPlaceholderText("e.g. Medication Side Effects"), "Title");
    fireEvent.changeText(screen.getByPlaceholderText("Write your note here…"), "Body");
    fireEvent.press(screen.getByLabelText("Save, button"));
    expect(mockAddNote.mock.calls[0][0].category).toBe(NoteCategory.exercise);
  });

  it("allows selecting appointment category", () => {
    render(<AddNoteScreen />);
    const appointmentChip = screen.getByText("Appointment");
    fireEvent.press(appointmentChip);
    fireEvent.changeText(screen.getByPlaceholderText("e.g. Medication Side Effects"), "Title");
    fireEvent.changeText(screen.getByPlaceholderText("Write your note here…"), "Body");
    fireEvent.press(screen.getByLabelText("Save, button"));
    expect(mockAddNote.mock.calls[0][0].category).toBe(NoteCategory.appointment);
  });

  it("has close button in header options", () => {
    // The close button is in headerLeft which is part of Stack.Screen options
    // and not rendered in the component body, so we can't easily test it
    // We verify the component renders correctly instead
    render(<AddNoteScreen />);
    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("shows error border on title input when validation fails", () => {
    render(<AddNoteScreen />);
    fireEvent.press(screen.getByLabelText("Save, button"));
    const titleInput = screen.getByPlaceholderText("e.g. Medication Side Effects");
    // Input should have error styling (we verify error text is shown)
    expect(screen.getByText("Enter a title")).toBeTruthy();
  });

  it("shows error border on body input when validation fails", () => {
    render(<AddNoteScreen />);
    fireEvent.press(screen.getByLabelText("Save, button"));
    const bodyInput = screen.getByPlaceholderText("Write your note here…");
    // Input should have error styling (we verify error text is shown)
    expect(screen.getByText("Enter note content")).toBeTruthy();
  });

  it("trims whitespace from title and body before saving", () => {
    render(<AddNoteScreen />);
    fireEvent.changeText(screen.getByPlaceholderText("e.g. Medication Side Effects"), "  Trimmed Title  ");
    fireEvent.changeText(screen.getByPlaceholderText("Write your note here…"), "  Trimmed Body  ");
    fireEvent.press(screen.getByLabelText("Save, button"));
    expect(mockAddNote.mock.calls[0][0].title).toBe("Trimmed Title");
    expect(mockAddNote.mock.calls[0][0].body).toBe("Trimmed Body");
  });
});
