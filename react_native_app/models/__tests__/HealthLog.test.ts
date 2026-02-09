// =============================================================================
// HEALTH LOG MODEL TESTS
// =============================================================================

import {
  HealthLogType,
  formatHealthLogTypeDisplay,
  bloodPressureCategoryLabel,
  heartRateCategoryLabel,
  getHealthLogDateOnly,
  healthLogHasProgress,
  healthLogProgressRatio,
  type HealthLog,
} from "../HealthLog";

describe("HealthLog model", () => {
  describe("formatHealthLogTypeDisplay", () => {
    it("returns 'Blood Pressure' for bloodPressure", () => {
      expect(formatHealthLogTypeDisplay(HealthLogType.bloodPressure)).toBe("Blood Pressure");
    });

    it("returns 'Heart Rate' for heartRate", () => {
      expect(formatHealthLogTypeDisplay(HealthLogType.heartRate)).toBe("Heart Rate");
    });

    it("returns capitalized name for other types", () => {
      expect(formatHealthLogTypeDisplay(HealthLogType.mood)).toBe("Mood");
      expect(formatHealthLogTypeDisplay(HealthLogType.water)).toBe("Water");
      expect(formatHealthLogTypeDisplay(HealthLogType.symptoms)).toBe("Symptoms");
      expect(formatHealthLogTypeDisplay(HealthLogType.meals)).toBe("Meals");
      expect(formatHealthLogTypeDisplay(HealthLogType.exercise)).toBe("Exercise");
      expect(formatHealthLogTypeDisplay(HealthLogType.sleep)).toBe("Sleep");
      expect(formatHealthLogTypeDisplay(HealthLogType.general)).toBe("General");
    });
  });

  describe("bloodPressureCategoryLabel", () => {
    it("returns 'Hypertensive crisis' for very high", () => {
      expect(bloodPressureCategoryLabel(180, 120)).toBe("Hypertensive crisis");
      expect(bloodPressureCategoryLabel(190, 110)).toBe("Hypertensive crisis");
    });

    it("returns 'High (Stage 2)' for stage 2", () => {
      expect(bloodPressureCategoryLabel(140, 90)).toBe("High (Stage 2)");
      expect(bloodPressureCategoryLabel(150, 95)).toBe("High (Stage 2)");
    });

    it("returns 'High (Stage 1)' for stage 1", () => {
      expect(bloodPressureCategoryLabel(130, 80)).toBe("High (Stage 1)");
      expect(bloodPressureCategoryLabel(135, 85)).toBe("High (Stage 1)");
    });

    it("returns 'Elevated' for elevated", () => {
      expect(bloodPressureCategoryLabel(120, 70)).toBe("Elevated");
      expect(bloodPressureCategoryLabel(125, 79)).toBe("Elevated");
    });

    it("returns 'Normal' for normal", () => {
      expect(bloodPressureCategoryLabel(110, 70)).toBe("Normal");
      expect(bloodPressureCategoryLabel(119, 79)).toBe("Normal");
    });
  });

  describe("heartRateCategoryLabel", () => {
    it("returns 'Bradycardia' for low", () => {
      expect(heartRateCategoryLabel(50)).toBe("Bradycardia");
      expect(heartRateCategoryLabel(59)).toBe("Bradycardia");
    });

    it("returns 'Normal' for 60-100", () => {
      expect(heartRateCategoryLabel(60)).toBe("Normal");
      expect(heartRateCategoryLabel(72)).toBe("Normal");
      expect(heartRateCategoryLabel(100)).toBe("Normal");
    });

    it("returns 'Tachycardia' for high", () => {
      expect(heartRateCategoryLabel(101)).toBe("Tachycardia");
      expect(heartRateCategoryLabel(120)).toBe("Tachycardia");
    });
  });

  describe("getHealthLogDateOnly", () => {
    it("returns date at midnight", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.mood,
        description: "Good",
        createdAt: new Date(2026, 1, 5, 14, 30),
      };
      const result = getHealthLogDateOnly(log);
      expect(result.getFullYear()).toBe(2026);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(5);
      expect(result.getHours()).toBe(0);
    });
  });

  describe("healthLogHasProgress", () => {
    it("returns true when waterTotal and waterGoal are set and goal > 0", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "48 oz",
        createdAt: new Date(),
        waterTotal: 48,
        waterGoal: 64,
      };
      expect(healthLogHasProgress(log)).toBe(true);
    });

    it("returns false when waterTotal is null", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
        waterGoal: 64,
      };
      expect(healthLogHasProgress(log)).toBe(false);
    });

    it("returns false when waterGoal is 0", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
        waterTotal: 48,
        waterGoal: 0,
      };
      expect(healthLogHasProgress(log)).toBe(false);
    });
  });

  describe("healthLogProgressRatio", () => {
    it("returns 0 when no progress", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
      };
      expect(healthLogProgressRatio(log)).toBe(0);
    });

    it("returns ratio when waterTotal and waterGoal set", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
        waterTotal: 32,
        waterGoal: 64,
      };
      expect(healthLogProgressRatio(log)).toBe(0.5);
    });

    it("returns min 1 when over goal", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
        waterTotal: 100,
        waterGoal: 64,
      };
      expect(healthLogProgressRatio(log)).toBe(1);
    });

    it("returns 0 when waterTotal is 0", () => {
      const log: HealthLog = {
        id: "1",
        type: HealthLogType.water,
        description: "x",
        createdAt: new Date(),
        waterTotal: 0,
        waterGoal: 64,
      };
      expect(healthLogProgressRatio(log)).toBe(0);
    });
  });
});
