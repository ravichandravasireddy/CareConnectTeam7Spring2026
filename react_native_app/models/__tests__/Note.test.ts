// =============================================================================
// NOTE MODEL TESTS
// =============================================================================

import { NoteCategory, formatNoteCategoryDisplay } from "../Note";

describe("Note model", () => {
  describe("formatNoteCategoryDisplay", () => {
    it("returns Medication for medication", () => {
      expect(formatNoteCategoryDisplay(NoteCategory.medication)).toBe("Medication");
    });

    it("returns Exercise for exercise", () => {
      expect(formatNoteCategoryDisplay(NoteCategory.exercise)).toBe("Exercise");
    });

    it("returns Appointment for appointment", () => {
      expect(formatNoteCategoryDisplay(NoteCategory.appointment)).toBe("Appointment");
    });
  });
});
