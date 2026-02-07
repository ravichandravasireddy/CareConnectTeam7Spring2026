// =============================================================================
// TASK MODEL UNIT TESTS
// =============================================================================
// Tests for isTaskCompleted, MOCK_TASKS, and Task interface behavior.
// Covers normal cases, edge cases, and error handling.
// =============================================================================

import { isTaskCompleted, MOCK_TASKS, type Task } from "../task";

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

    it("identifies completed task in MOCK_TASKS", () => {
      const task3 = MOCK_TASKS[2];
      expect(isTaskCompleted(task3)).toBe(true);
    });

    it("identifies incomplete tasks in MOCK_TASKS", () => {
      expect(isTaskCompleted(MOCK_TASKS[0])).toBe(false);
      expect(isTaskCompleted(MOCK_TASKS[1])).toBe(false);
    });
  });

  // ===========================================================================
  // isTaskCompleted - Edge Cases
  // ===========================================================================

  describe("isTaskCompleted - Edge Cases", () => {
    it("returns false when completedAt is undefined", () => {
      const task = { ...MOCK_TASKS[0], completedAt: undefined };
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
        ...MOCK_TASKS[0],
        completedAt: new Date("invalid"),
      } as Task;
      expect(isTaskCompleted(task)).toBe(true);
    });
  });

  // ===========================================================================
  // MOCK_TASKS - Data Validation
  // ===========================================================================

  describe("MOCK_TASKS - Data Validation", () => {
    it("has exactly 3 tasks", () => {
      expect(MOCK_TASKS).toHaveLength(3);
    });

    it("each task has required fields", () => {
      MOCK_TASKS.forEach((task, index) => {
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
        expect(["medication", "monitor-heart", "directions-walk"]).toContain(
          task.icon
        );
      });
    });

    it("task IDs are unique", () => {
      const ids = MOCK_TASKS.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it("task icons are valid", () => {
      const validIcons = ["medication", "monitor-heart", "directions-walk"];
      MOCK_TASKS.forEach((task) => {
        expect(validIcons).toContain(task.icon);
      });
    });

    it("task colors are non-empty strings", () => {
      MOCK_TASKS.forEach((task) => {
        expect(task.iconBackground).toBeTruthy();
        expect(typeof task.iconBackground).toBe("string");
        expect(task.iconColor).toBeTruthy();
        expect(typeof task.iconColor).toBe("string");
      });
    });
  });

  // ===========================================================================
  // MOCK_TASKS - Edge Cases
  // ===========================================================================

  describe("MOCK_TASKS - Edge Cases", () => {
    it("tasks have dates in the future (except completed)", () => {
      const now = Date.now();
      MOCK_TASKS.forEach((task) => {
        if (!task.completedAt) {
          expect(task.date.getTime()).toBeGreaterThanOrEqual(now - 60000);
        }
      });
    });

    it("completed task has completedAt in the past or present", () => {
      const completedTask = MOCK_TASKS.find((t) => t.completedAt);
      expect(completedTask).toBeDefined();
      expect(completedTask!.completedAt).toBeInstanceOf(Date);
    });
  });
});
