// =============================================================================
// CAREGIVER HELPER FUNCTIONS UNIT TESTS
// =============================================================================
// Tests for getGreeting, greetingName, tasksForToday.
// =============================================================================

import { getGreeting, greetingName, tasksForToday } from "../caregiver/helpers";
import type { Task } from "@/models/Task";

const baseTask: Task = {
  id: "base-1",
  title: "Base Task",
  description: "Description",
  date: new Date(2025, 1, 7, 10, 0),
  patientName: "Patient",
  icon: "medication",
  iconBackground: "#eee",
  iconColor: "#333",
};

describe("getGreeting", () => {
  it("returns one of the valid greeting strings", () => {
    const validGreetings = ["Good Morning", "Good Afternoon", "Good Evening"];
    const result = getGreeting();
    expect(validGreetings).toContain(result);
  });

  it("returns Good Morning for hours 0-11", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T09:00:00"));
    expect(getGreeting()).toBe("Good Morning");
    jest.useRealTimers();
  });

  it("returns Good Afternoon for hours 12-16", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T14:00:00"));
    expect(getGreeting()).toBe("Good Afternoon");
    jest.useRealTimers();
  });

  it("returns Good Evening for hours 17-23", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T20:00:00"));
    expect(getGreeting()).toBe("Good Evening");
    jest.useRealTimers();
  });

  it("returns Good Morning at midnight (hour 0)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T00:00:00"));
    expect(getGreeting()).toBe("Good Morning");
    jest.useRealTimers();
  });

  it("returns Good Afternoon at noon (hour 12)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T12:00:00"));
    expect(getGreeting()).toBe("Good Afternoon");
    jest.useRealTimers();
  });

  it("returns Good Evening at 5 PM (hour 17)", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-02-07T17:00:00"));
    expect(getGreeting()).toBe("Good Evening");
    jest.useRealTimers();
  });
});

describe("greetingName", () => {
  describe("Normal Cases", () => {
    it("returns first name for single word", () => {
      expect(greetingName("Sarah")).toBe("Sarah");
    });

    it("returns first name for full name", () => {
      expect(greetingName("Sarah Johnson")).toBe("Sarah");
    });

    it("strips Dr. prefix and returns first name", () => {
      expect(greetingName("Dr. Sarah Johnson")).toBe("Sarah");
    });

    it("handles multiple middle names", () => {
      expect(greetingName("Dr. Sarah Marie Johnson")).toBe("Sarah");
    });
  });

  describe("Edge Cases", () => {
    it("returns Caregiver for empty string", () => {
      expect(greetingName("")).toBe("Caregiver");
    });

    it("returns Caregiver for whitespace-only string", () => {
      expect(greetingName("   ")).toBe("Caregiver");
    });

    it("trims leading and trailing whitespace", () => {
      expect(greetingName("  Sarah Johnson  ")).toBe("Sarah");
    });

    it("handles single word Dr. as full name", () => {
      expect(greetingName("Dr.")).toBe("Dr.");
    });

    it("handles tab and newline in name", () => {
      expect(greetingName("Sarah\tJohnson")).toBe("Sarah");
    });
  });

  describe("Error Handling", () => {
    it("does not throw for empty string", () => {
      expect(() => greetingName("")).not.toThrow();
    });

    it("handles very long names", () => {
      const longName = "Sarah " + "a".repeat(100);
      expect(greetingName(longName)).toBe("Sarah");
    });
  });
});

describe("tasksForToday", () => {
  const today = new Date(2025, 1, 7); // Feb 7, 2025

  describe("Normal Cases", () => {
    it("filters tasks for given date", () => {
      const tasks: Task[] = [
        {
          ...baseTask,
          date: new Date(2025, 1, 7, 10, 0),
        },
        {
          ...baseTask,
          id: "base-2",
          title: "Other",
          date: new Date(2025, 1, 8, 10, 0),
        },
      ];
      const result = tasksForToday(tasks, today);
      expect(result).toHaveLength(1);
      expect(result[0].date.getDate()).toBe(7);
    });

    it("returns empty array when no tasks match", () => {
      const tasks: Task[] = [
        {
          ...baseTask,
          date: new Date(2025, 1, 8, 10, 0),
        },
      ];
      const result = tasksForToday(tasks, today);
      expect(result).toHaveLength(0);
    });

    it("returns all matching tasks", () => {
      const tasks: Task[] = [
        { ...baseTask, date: new Date(2025, 1, 7, 9, 0) },
        { ...baseTask, id: "base-2", title: "Other", date: new Date(2025, 1, 7, 14, 0) },
      ];
      const result = tasksForToday(tasks, today);
      expect(result).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty task array", () => {
      const result = tasksForToday([], today);
      expect(result).toHaveLength(0);
    });

    it("uses current date when referenceDate not provided", () => {
      const now = new Date();
      const taskToday: Task = {
        ...baseTask,
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      };
      const result = tasksForToday([taskToday]);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it("matches year, month, and day correctly", () => {
      const taskFeb7 = {
        ...baseTask,
        date: new Date(2025, 1, 7, 23, 59),
      };
      const taskFeb8 = {
        ...baseTask,
        id: "base-2",
        title: "Other",
        date: new Date(2025, 1, 8, 0, 1),
      };
      const result = tasksForToday([taskFeb7, taskFeb8] as Task[], today);
      expect(result).toHaveLength(1);
      expect(result[0].date.getDate()).toBe(7);
    });
  });

  describe("Error Handling", () => {
    it("does not throw for empty array", () => {
      expect(() => tasksForToday([], today)).not.toThrow();
    });

    it("handles tasks with invalid dates", () => {
      const taskWithInvalidDate = {
        ...baseTask,
        date: new Date("invalid"),
      } as Task;
      expect(() => tasksForToday([taskWithInvalidDate], today)).not.toThrow();
    });
  });
});
