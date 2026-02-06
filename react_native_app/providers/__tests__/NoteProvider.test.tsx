// =============================================================================
// NOTE PROVIDER TESTS
// =============================================================================

import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { NoteProvider, useNoteProvider } from "../NoteProvider";
import { Note, NoteCategory } from "@/models/Note";

const mockNote: Note = {
  id: "new-1",
  title: "New Note",
  body: "Body text",
  author: "Test Author",
  createdAt: new Date(2026, 1, 5, 10, 0),
  category: NoteCategory.medication,
};

function Consumer() {
  const { notes, getById, addNote, deleteNote, clearNotes, categoryColors } = useNoteProvider();
  const found = getById("1");
  const colors = categoryColors(NoteCategory.medication);
  return (
    <View>
      <Text testID="count">{notes.length}</Text>
      <Text testID="found">{found ? found.title : "none"}</Text>
      <Text testID="color-bg">{colors.bg}</Text>
      <TouchableOpacity testID="add" onPress={() => addNote(mockNote)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="delete" onPress={() => deleteNote("new-1")}>
        <Text>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear" onPress={() => clearNotes()}>
        <Text>Clear</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("NoteProvider", () => {
  it("provides initial notes", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    expect(Number(screen.getByTestId("count").props.children)).toBeGreaterThanOrEqual(1);
  });

  it("getById returns note when found", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    expect(screen.getByTestId("found").props.children).not.toBe("none");
  });

  it("categoryColors returns bg and fg", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    expect(screen.getByTestId("color-bg").props.children).toBeTruthy();
  });

  it("addNote adds a note", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    const before = Number(screen.getByTestId("count").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(before + 1);
  });

  it("deleteNote removes a note", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    const afterAdd = Number(screen.getByTestId("count").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("delete"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(afterAdd - 1);
  });

  it("clearNotes empties notes", () => {
    render(
      <NoteProvider>
        <Consumer />
      </NoteProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("clear"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(0);
  });

  it("throws when useNoteProvider used outside provider", () => {
    expect(() => render(<Consumer />)).toThrow("useNoteProvider must be used within NoteProvider");
  });

  it("getById returns undefined when note not found", () => {
    function NotFoundConsumer() {
      const { getById } = useNoteProvider();
      const found = getById("non-existent-id");
      return <Text testID="found">{found ? found.title : "none"}</Text>;
    }
    render(
      <NoteProvider>
        <NotFoundConsumer />
      </NoteProvider>
    );
    expect(screen.getByTestId("found").props.children).toBe("none");
  });

  it("categoryColors returns correct colors for all categories", () => {
    function ColorConsumer() {
      const { categoryColors } = useNoteProvider();
      return (
        <View>
          <Text testID="medication">{categoryColors(NoteCategory.medication).bg}</Text>
          <Text testID="exercise">{categoryColors(NoteCategory.exercise).bg}</Text>
          <Text testID="appointment">{categoryColors(NoteCategory.appointment).bg}</Text>
        </View>
      );
    }
    render(
      <NoteProvider>
        <ColorConsumer />
      </NoteProvider>
    );
    expect(screen.getByTestId("medication").props.children).toBeTruthy();
    expect(screen.getByTestId("exercise").props.children).toBeTruthy();
    expect(screen.getByTestId("appointment").props.children).toBeTruthy();
  });

  it("updateNote updates existing note", () => {
    function UpdateConsumer() {
      const { notes, updateNote } = useNoteProvider();
      const firstNote = notes[0];
      return (
        <View>
          <Text testID="title">{firstNote?.title || "none"}</Text>
          <TouchableOpacity
            testID="update"
            onPress={() => firstNote && updateNote({ ...firstNote, title: "Updated Title" })}
          >
            <Text>Update</Text>
          </TouchableOpacity>
        </View>
      );
    }
    render(
      <NoteProvider>
        <UpdateConsumer />
      </NoteProvider>
    );
    const before = screen.getByTestId("title").props.children;
    act(() => {
      fireEvent.press(screen.getByTestId("update"));
    });
    // Title should be updated
    const after = screen.getByTestId("title").props.children;
    if (before !== "none") {
      expect(after).toBe("Updated Title");
    }
  });

  it("notes are sorted by createdAt descending after add", () => {
    function SortConsumer() {
      const { notes, addNote, clearNotes } = useNoteProvider();
      const olderNote: Note = {
        id: "older",
        title: "Older",
        body: "Body",
        author: "Author",
        createdAt: new Date(2026, 1, 1, 10, 0),
        category: NoteCategory.medication,
      };
      const newerNote: Note = {
        id: "newer",
        title: "Newer",
        body: "Body",
        author: "Author",
        createdAt: new Date(2026, 1, 5, 10, 0),
        category: NoteCategory.medication,
      };
      return (
        <View>
          <Text testID="first">{notes[0]?.title || "none"}</Text>
          <Text testID="second">{notes[1]?.title || "none"}</Text>
          <TouchableOpacity testID="clear" onPress={() => clearNotes()}>
            <Text>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="add-older" onPress={() => addNote(olderNote)}>
            <Text>Add Older</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="add-newer" onPress={() => addNote(newerNote)}>
            <Text>Add Newer</Text>
          </TouchableOpacity>
        </View>
      );
    }
    render(
      <NoteProvider>
        <SortConsumer />
      </NoteProvider>
    );
    // Clear initial notes first
    act(() => {
      fireEvent.press(screen.getByTestId("clear"));
    });
    act(() => {
      fireEvent.press(screen.getByTestId("add-older"));
    });
    act(() => {
      fireEvent.press(screen.getByTestId("add-newer"));
    });
    // Newer note should be first
    expect(screen.getByTestId("first").props.children).toBe("Newer");
    expect(screen.getByTestId("second").props.children).toBe("Older");
  });
});
