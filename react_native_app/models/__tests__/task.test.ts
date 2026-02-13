// =============================================================================
// TASK MODEL TESTS
// =============================================================================

import {
  isTaskCompleted,
  getTaskDateOnly,
  areDatesEqual,
  type Task,
} from "../Task";

describe("Task model", () => {
  describe("isTaskCompleted", () => {
    it("returns true when completedAt is a Date", () => {
      const task: Task = {
        id: "1",
        title: "T",
        description: "",
        date: new Date(),
        patientName: "P",
        icon: "check-circle",
        iconBackground: "#eee",
        iconColor: "#333",
        completedAt: new Date(2026, 1, 5, 10, 0),
      };
      expect(isTaskCompleted(task)).toBe(true);
    });

    it("returns false when completedAt is undefined", () => {
      const task: Task = {
        id: "1",
        title: "T",
        description: "",
        date: new Date(),
        patientName: "P",
        icon: "check-circle",
        iconBackground: "#eee",
        iconColor: "#333",
      };
      expect(isTaskCompleted(task)).toBe(false);
    });

    it("returns false when completedAt is null", () => {
      const task = {
        id: "1",
        title: "T",
        description: "",
        date: new Date(),
        patientName: "P",
        icon: "check-circle" as const,
        iconBackground: "#eee",
        iconColor: "#333",
        completedAt: null,
      };
      expect(isTaskCompleted(task)).toBe(false);
    });
  });

  describe("getTaskDateOnly", () => {
    it("returns date at midnight for given date", () => {
      const d = new Date(2026, 1, 5, 14, 30, 45);
      const result = getTaskDateOnly(d);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(5);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe("areDatesEqual", () => {
    it("returns true when same calendar day", () => {
      const d1 = new Date(2026, 1, 5, 9, 0);
      const d2 = new Date(2026, 1, 5, 18, 30);
      expect(areDatesEqual(d1, d2)).toBe(true);
    });

    it("returns false when different day", () => {
      const d1 = new Date(2026, 1, 5);
      const d2 = new Date(2026, 1, 6);
      expect(areDatesEqual(d1, d2)).toBe(false);
    });

    it("returns false when different month", () => {
      const d1 = new Date(2026, 0, 5);
      const d2 = new Date(2026, 1, 5);
      expect(areDatesEqual(d1, d2)).toBe(false);
    });

    it("returns false when different year", () => {
      const d1 = new Date(2025, 1, 5);
      const d2 = new Date(2026, 1, 5);
      expect(areDatesEqual(d1, d2)).toBe(false);
    });
  });
});
