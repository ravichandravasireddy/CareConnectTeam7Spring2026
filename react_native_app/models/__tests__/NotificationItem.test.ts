// =============================================================================
// NOTIFICATION MODEL TESTS
// =============================================================================

import {
  NotificationType,
  getDestinationRoute,
  isTaskRelated,
} from "../NotificationItem";

describe("NotificationItem model", () => {
  describe("getDestinationRoute", () => {
    it("returns /task-details for task-related types", () => {
      expect(getDestinationRoute(NotificationType.medication)).toBe("/task-details");
      expect(getDestinationRoute(NotificationType.appointment)).toBe("/task-details");
      expect(getDestinationRoute(NotificationType.healthReminder)).toBe("/task-details");
      expect(getDestinationRoute(NotificationType.generalReminder)).toBe("/task-details");
    });

    it("returns /messages for message type", () => {
      expect(getDestinationRoute(NotificationType.message)).toBe("/messages");
    });
  });

  describe("isTaskRelated", () => {
    it("returns true for medication, appointment, healthReminder, generalReminder", () => {
      expect(isTaskRelated(NotificationType.medication)).toBe(true);
      expect(isTaskRelated(NotificationType.appointment)).toBe(true);
      expect(isTaskRelated(NotificationType.healthReminder)).toBe(true);
      expect(isTaskRelated(NotificationType.generalReminder)).toBe(true);
    });

    it("returns false for message", () => {
      expect(isTaskRelated(NotificationType.message)).toBe(false);
    });
  });
});
