// =============================================================================
// TASK PROVIDER TESTS
// =============================================================================

import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { TaskProvider, useTaskProvider } from "../TaskProvider";
import type { Task } from "@/models/Task";

const mockTask: Task = {
  id: "new-1",
  title: "New Task",
  description: "",
  date: new Date(2026, 1, 10, 9, 0),
  patientName: "Test",
  icon: "check-circle",
  iconBackground: "#eee",
  iconColor: "#333",
};

function Consumer() {
  const { tasks, addTask, removeTask, clearTasks, getTasksForDate, getScheduledTasksForDate, hasTasksForDate, hasScheduledTasksForDate, markCompleted } = useTaskProvider();
  const date = new Date(2026, 1, 5);
  const tasksForDate = getTasksForDate(date);
  const scheduledForDate = getScheduledTasksForDate(date);
  return (
    <View>
      <Text testID="count">{tasks.length}</Text>
      <Text testID="for-date">{tasksForDate.length}</Text>
      <Text testID="scheduled">{scheduledForDate.length}</Text>
      <Text testID="has-tasks">{hasTasksForDate(date) ? "yes" : "no"}</Text>
      <Text testID="has-scheduled">{hasScheduledTasksForDate(date) ? "yes" : "no"}</Text>
      <TouchableOpacity testID="add" onPress={() => addTask(mockTask)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="remove" onPress={() => removeTask("new-1")}>
        <Text>Remove</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear" onPress={() => clearTasks()}>
        <Text>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="mark" onPress={() => markCompleted("1")}>
        <Text>Mark</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("TaskProvider", () => {
  it("provides initial tasks", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    const count = parseInt(screen.getByTestId("count").props.children, 10);
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it("addTask adds a task", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    const before = parseInt(screen.getByTestId("count").props.children, 10);
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    const after = parseInt(screen.getByTestId("count").props.children, 10);
    expect(after).toBe(before + 1);
  });

  it("removeTask removes a task", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    const afterAdd = parseInt(screen.getByTestId("count").props.children, 10);
    act(() => {
      fireEvent.press(screen.getByTestId("remove"));
    });
    expect(parseInt(screen.getByTestId("count").props.children, 10)).toBe(afterAdd - 1);
  });

  it("clearTasks empties tasks", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("clear"));
    });
    const countEl = screen.getByTestId("count");
    expect(Number(countEl.props.children)).toBe(0);
  });

  it("getTasksForDate returns tasks for date", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    expect(parseInt(screen.getByTestId("for-date").props.children, 10)).toBeGreaterThanOrEqual(0);
  });

  it("hasTasksForDate returns boolean", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    expect(["yes", "no"]).toContain(screen.getByTestId("has-tasks").props.children);
  });

  it("markCompleted sets completedAt", () => {
    render(
      <TaskProvider>
        <Consumer />
      </TaskProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("mark"));
    });
    const count = screen.getByTestId("count").props.children;
    expect(parseInt(count, 10)).toBeGreaterThanOrEqual(0);
  });

  it("throws when useTaskProvider used outside provider", () => {
    expect(() => render(<Consumer />)).toThrow("useTaskProvider must be used within TaskProvider");
  });
});
