// =============================================================================
// useHealthTimelineEvents HOOK TESTS
// =============================================================================
// SWEN 661 - Verifies aggregation of health logs, notes, and completed tasks
// into a single sorted timeline. Only completed tasks are included.
// =============================================================================

import { renderHook } from "@testing-library/react-native";
import { TimelineEventSource } from "@/models/TimelineEvent";
import { HealthLogType } from "@/models/HealthLog";
import { NoteCategory } from "@/models/Note";
import type { HealthLog } from "@/models/HealthLog";
import type { Note } from "@/models/Note";
import type { Task } from "@/models/task";

const mockLogs: HealthLog[] = [];
const mockNotes: Note[] = [];
const mockTasks: Task[] = [];
const mockTypeColors = jest.fn((_t: HealthLogType) => ({ bg: "#E3F2FD", fg: "#1976D2" }));
const mockCategoryColors = jest.fn((_c: NoteCategory) => ({ bg: "#F3E5F5", fg: "#7B1FA2" }));

jest.mock("../../providers/HealthLogProvider", () => ({
  useHealthLogProvider: () => ({
    logs: mockLogs,
    typeColors: mockTypeColors,
  }),
}));

jest.mock("../../providers/NoteProvider", () => ({
  useNoteProvider: () => ({
    notes: mockNotes,
    categoryColors: mockCategoryColors,
  }),
}));

jest.mock("../../providers/TaskProvider", () => ({
  useTaskProvider: () => ({
    tasks: mockTasks,
  }),
}));

import { useHealthTimelineEvents } from "../useHealthTimelineEvents";

describe("useHealthTimelineEvents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogs.length = 0;
    mockNotes.length = 0;
    mockTasks.length = 0;
  });

  it("returns empty array when all providers are empty", () => {
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current).toEqual([]);
  });

  it("returns health log events when logs exist", () => {
    mockLogs.push({
      id: "log-1",
      type: HealthLogType.mood,
      description: "Feeling good",
      createdAt: new Date(2026, 1, 5, 10, 0),
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("health-log-1");
    expect(result.current[0].source).toBe(TimelineEventSource.healthLog);
    expect(result.current[0].title).toBe("Mood");
    expect(result.current[0].subtitle).toBe("Feeling good");
    expect(result.current[0].icon).toBe("sentiment-satisfied");
  });

  it("returns note events when notes exist", () => {
    mockNotes.push({
      id: "note-1",
      title: "Visit",
      body: "Patient doing well",
      author: "Sarah",
      createdAt: new Date(2026, 1, 5, 11, 0),
      category: NoteCategory.medication,
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("note-note-1");
    expect(result.current[0].source).toBe(TimelineEventSource.note);
    expect(result.current[0].title).toBe("Note Added");
    expect(result.current[0].subtitle).toBe("Patient doing well");
    expect(result.current[0].icon).toBe("description");
  });

  it("includes only completed tasks", () => {
    mockTasks.push(
      {
        id: "task-1",
        title: "Morning Medication",
        description: "",
        date: new Date(2026, 1, 5),
        patientName: "Robert",
        icon: "medication",
        iconBackground: "#E3F2FD",
        iconColor: "#1976D2",
        completedAt: new Date(2026, 1, 5, 9, 0),
      },
      {
        id: "task-2",
        title: "Incomplete Task",
        description: "",
        date: new Date(2026, 1, 5),
        patientName: "Robert",
        icon: "check-circle",
        iconBackground: "#E8F5E9",
        iconColor: "#2E7D32",
        // no completedAt
      },
    );
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe("task-task-1");
    expect(result.current[0].source).toBe(TimelineEventSource.task);
    expect(result.current[0].title).toBe("Task Completed");
    expect(result.current[0].subtitle).toBe("Morning Medication");
  });

  it("merges and sorts events by timestamp descending", () => {
    mockLogs.push({
      id: "log-1",
      type: HealthLogType.water,
      description: "Drank water",
      createdAt: new Date(2026, 1, 5, 8, 0),
    });
    mockNotes.push({
      id: "note-1",
      title: "Note",
      body: "Body",
      author: "A",
      createdAt: new Date(2026, 1, 5, 10, 0),
      category: NoteCategory.appointment,
    });
    mockTasks.push({
      id: "task-1",
      title: "Task",
      description: "",
      date: new Date(2026, 1, 5),
      patientName: "P",
      icon: "check-circle",
      iconBackground: "#E8F5E9",
      iconColor: "#2E7D32",
      completedAt: new Date(2026, 1, 5, 9, 0),
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current).toHaveLength(3);
    // Newest first: note 10:00, task 9:00, log 8:00
    expect(result.current[0].timestamp.getTime()).toBe(new Date(2026, 1, 5, 10, 0).getTime());
    expect(result.current[1].timestamp.getTime()).toBe(new Date(2026, 1, 5, 9, 0).getTime());
    expect(result.current[2].timestamp.getTime()).toBe(new Date(2026, 1, 5, 8, 0).getTime());
  });

  it("adds blood pressure statusLabel and subtitle for blood pressure logs", () => {
    mockLogs.push({
      id: "bp-1",
      type: HealthLogType.bloodPressure,
      description: "Morning reading",
      createdAt: new Date(2026, 1, 5, 9, 0),
      systolic: 130,
      diastolic: 85,
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current[0].title).toBe("Blood Pressure");
    expect(result.current[0].statusLabel).toBe("High (Stage 1)");
    expect(result.current[0].subtitle).toContain("Morning reading");
    expect(result.current[0].subtitle).toContain("High (Stage 1)");
  });

  it("adds heart rate statusLabel for heart rate logs", () => {
    mockLogs.push({
      id: "hr-1",
      type: HealthLogType.heartRate,
      description: "Resting",
      createdAt: new Date(2026, 1, 5, 9, 0),
      heartRateBpm: 72,
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current[0].title).toBe("Heart Rate");
    expect(result.current[0].statusLabel).toBe("Normal");
  });

  it("appends note to health log subtitle when log.note is set", () => {
    mockLogs.push({
      id: "log-1",
      type: HealthLogType.mood,
      description: "Good",
      note: "Follow up next week",
      createdAt: new Date(2026, 1, 5, 9, 0),
    });
    const { result } = renderHook(() => useHealthTimelineEvents());
    expect(result.current[0].subtitle).toContain("Good");
    expect(result.current[0].subtitle).toContain("Follow up next week");
  });

  it("calls typeColors with log type for health logs", () => {
    mockLogs.push({
      id: "log-1",
      type: HealthLogType.sleep,
      description: "8 hours",
      createdAt: new Date(2026, 1, 5, 9, 0),
    });
    renderHook(() => useHealthTimelineEvents());
    expect(mockTypeColors).toHaveBeenCalledWith(HealthLogType.sleep);
  });

  it("calls categoryColors with note category for notes", () => {
    mockNotes.push({
      id: "note-1",
      title: "T",
      body: "B",
      author: "A",
      createdAt: new Date(2026, 1, 5, 9, 0),
      category: NoteCategory.exercise,
    });
    renderHook(() => useHealthTimelineEvents());
    expect(mockCategoryColors).toHaveBeenCalledWith(NoteCategory.exercise);
  });
});
