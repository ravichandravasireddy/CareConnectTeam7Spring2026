// =============================================================================
// TASK MODEL UNIT TESTS
// =============================================================================
// Tests for isTaskCompleted, getTaskDateOnly, areDatesEqual, and Task shape.
// Mock/sample tasks live in TaskProvider; tests use local sample data.
// =============================================================================

import {
  isTaskCompleted,
  getTaskDateOnly,
  areDatesEqual,
  type Task,
  type TaskIconName,
} from "../task";

/** Sample tasks for model unit tests (mirrors shape from TaskProvider). */
const SAMPLE_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Metformin 500mg",
    description: "Medication reminder",
    date: new Date(Date.now() + 60 * 60 * 1000),
    patientName: "Maya Patel",
    icon: "medication",
    iconBackground: "#e3f2fd",
    iconColor: "#1976d2",
  },
  {
    id: "task-2",
    title: "Blood pressure log",
    description: "Record BP and upload to the care plan.",
    date: new Date(Date.now() + 3 * 60 * 60 * 1000),
    patientName: "Mary Johnson",
    icon: "favorite",
    iconBackground: "#fce4ec",
    iconColor: "#c2185b",
  },
  {
    id: "task-3",
    title: "Evening walk",
    description: "Assist with 15-minute walk after dinner.",
    date: new Date(Date.now() + 6 * 60 * 60 * 1000),
    patientName: "James Carter",
    icon: "directions-walk",
    iconBackground: "#e8f5e9",
    iconColor: "#388e3c",
    completedAt: new Date(),
  },
];

const VALID_TASK_ICONS: TaskIconName[] = [
  "medication",
  "favorite",
  "directions-walk",
  "fitness-center",
  "local-hospital",
  "science",
  "medication-liquid",
  "videocam",
  "phone",
];

describe("Task Model", () => {
  // ===========================================================================
  // isTaskCompleted - Normal Cases
  // ===========================================================================

  describe("isTaskCompleted - Normal Cases", () => {
    it("returns true when task has completedAt date", () => {
      const completedTask: Task = {
        id: "1",
        title: "Test",
        description: "",
        date: new Date(),
        patientName: "",
        icon: "medication",
        iconBackground: "#fff",
        iconColor: "#000",
        completedAt: new Date(),
      };
      expect(isTaskCompleted(completedTask)).toBe(true);
    });

    it("returns false when task has no completedAt", () => {
      const incompleteTask: Task = {
        id: "1",
        title: "Test",
        description: "",
        date: new Date(),
        patientName: "",
        icon: "medication",
        iconBackground: "#fff",
        iconColor: "#000",
      };
      expect(isTaskCompleted(incompleteTask)).toBe(false);
    });

    it("identifies completed task in sample tasks", () => {
      const task3 = SAMPLE_TASKS[2];
      expect(isTaskCompleted(task3)).toBe(true);
    });

    it("identifies incomplete tasks in sample tasks", () => {
      expect(isTaskCompleted(SAMPLE_TASKS[0])).toBe(false);
      expect(isTaskCompleted(SAMPLE_TASKS[1])).toBe(false);
    });
  });

  // ===========================================================================
  // isTaskCompleted - Edge Cases
  // ===========================================================================

  describe("isTaskCompleted - Edge Cases", () => {
    it("returns false when completedAt is undefined", () => {
      const task = { ...SAMPLE_TASKS[0], completedAt: undefined };
      expect(isTaskCompleted(task)).toBe(false);
    });

    it("returns false when completedAt is explicitly undefined in object", () => {
      const task: Task = {
        id: "1",
        title: "Test",
        description: "",
        date: new Date(),
        patientName: "",
        icon: "medication",
        iconBackground: "#fff",
        iconColor: "#000",
        completedAt: undefined,
      };
      expect(isTaskCompleted(task)).toBe(false);
    });

    it("returns true when completedAt is invalid date (still truthy)", () => {
      const task = {
        ...SAMPLE_TASKS[0],
        completedAt: new Date("invalid"),
      } as Task;
      expect(isTaskCompleted(task)).toBe(true);
    });
  });

  // ===========================================================================
  // getTaskDateOnly & areDatesEqual
  // ===========================================================================

  describe("getTaskDateOnly", () => {
    it("strips time to local midnight", () => {
      const d = new Date(2026, 1, 7, 14, 30, 0);
      const only = getTaskDateOnly(d);
      expect(only.getFullYear()).toBe(2026);
      expect(only.getMonth()).toBe(1);
      expect(only.getDate()).toBe(7);
      expect(only.getHours()).toBe(0);
      expect(only.getMinutes()).toBe(0);
      expect(only.getSeconds()).toBe(0);
    });
  });

  describe("areDatesEqual", () => {
    it("returns true for same calendar day", () => {
      const a = new Date(2026, 1, 7, 9, 0);
      const b = new Date(2026, 1, 7, 18, 30);
      expect(areDatesEqual(a, b)).toBe(true);
    });
    it("returns false for different days", () => {
      const a = new Date(2026, 1, 7, 9, 0);
      const b = new Date(2026, 1, 8, 9, 0);
      expect(areDatesEqual(a, b)).toBe(false);
    });
  });

  // ===========================================================================
  // Sample Task[] shape validation
  // ===========================================================================

  describe("Sample Task[] shape validation", () => {
    it("sample has exactly 3 tasks", () => {
      expect(SAMPLE_TASKS).toHaveLength(3);
    });

    it("each task has required fields", () => {
      SAMPLE_TASKS.forEach((task) => {
        expect(task).toHaveProperty("id");
        expect(task).toHaveProperty("title");
        expect(task).toHaveProperty("description");
        expect(task).toHaveProperty("date");
        expect(task).toHaveProperty("patientName");
        expect(task).toHaveProperty("icon");
        expect(task).toHaveProperty("iconBackground");
        expect(task).toHaveProperty("iconColor");
        expect(typeof task.id).toBe("string");
        expect(typeof task.title).toBe("string");
        expect(task.date).toBeInstanceOf(Date);
        expect(VALID_TASK_ICONS).toContain(task.icon);
      });
    });

    it("task IDs are unique", () => {
      const ids = SAMPLE_TASKS.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("task icons are valid", () => {
      SAMPLE_TASKS.forEach((task) => {
        expect(VALID_TASK_ICONS).toContain(task.icon);
      });
    });

    it("task colors are non-empty strings", () => {
      SAMPLE_TASKS.forEach((task) => {
        expect(task.iconBackground).toBeTruthy();
        expect(typeof task.iconBackground).toBe("string");
        expect(task.iconColor).toBeTruthy();
        expect(typeof task.iconColor).toBe("string");
      });
    });

    it("completed task has completedAt", () => {
      const completedTask = SAMPLE_TASKS.find((t) => t.completedAt);
      expect(completedTask).toBeDefined();
      expect(completedTask!.completedAt).toBeInstanceOf(Date);
    });
  });
});
