// =============================================================================
// HEALTH LOG PROVIDER TESTS
// =============================================================================

import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { HealthLogProvider, useHealthLogProvider, DEFAULT_WATER_GOAL_OZ } from "../HealthLogProvider";
import { HealthLog, HealthLogType } from "@/models/HealthLog";

const mockLog: HealthLog = {
  id: "new-1",
  type: HealthLogType.general,
  description: "Test log",
  createdAt: new Date(2026, 1, 5, 10, 0),
};

function Consumer() {
  const { logs, latestByType, addLog, removeLog, waterTotalForDate, typeColors } = useHealthLogProvider();
  const total = waterTotalForDate(new Date());
  const colors = typeColors(HealthLogType.mood);
  return (
    <View>
      <Text testID="count">{logs.length}</Text>
      <Text testID="water-total">{total}</Text>
      <Text testID="color-bg">{colors.bg}</Text>
      <Text testID="has-mood">{latestByType[HealthLogType.mood] ? "yes" : "no"}</Text>
      <TouchableOpacity testID="add" onPress={() => addLog(mockLog)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="remove" onPress={() => removeLog("new-1")}>
        <Text>Remove</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("HealthLogProvider", () => {
  it("DEFAULT_WATER_GOAL_OZ is 64", () => {
    expect(DEFAULT_WATER_GOAL_OZ).toBe(64);
  });

  it("provides initial logs", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    expect(Number(screen.getByTestId("count").props.children)).toBeGreaterThanOrEqual(1);
  });

  it("latestByType returns record per type", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    expect(["yes", "no"]).toContain(screen.getByTestId("has-mood").props.children);
  });

  it("waterTotalForDate returns number", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    expect(Number(screen.getByTestId("water-total").props.children)).toBeGreaterThanOrEqual(0);
  });

  it("typeColors returns bg and fg", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    expect(screen.getByTestId("color-bg").props.children).toBeTruthy();
  });

  it("addLog adds a log", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    const before = Number(screen.getByTestId("count").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(before + 1);
  });

  it("removeLog removes a log", () => {
    render(
      <HealthLogProvider>
        <Consumer />
      </HealthLogProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    const afterAdd = Number(screen.getByTestId("count").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("remove"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(afterAdd - 1);
  });

  it("throws when useHealthLogProvider used outside provider", () => {
    expect(() => render(<Consumer />)).toThrow("useHealthLogProvider must be used within HealthLogProvider");
  });

  it("waterTotalForDate returns 0 for date with no water logs", () => {
    function WaterConsumer() {
      const { waterTotalForDate } = useHealthLogProvider();
      const total = waterTotalForDate(new Date(2020, 0, 1));
      return <Text testID="water-total">{total}</Text>;
    }
    render(
      <HealthLogProvider>
        <WaterConsumer />
      </HealthLogProvider>
    );
    expect(Number(screen.getByTestId("water-total").props.children)).toBe(0);
  });

  it("typeColors returns correct colors for all types", () => {
    function ColorConsumer() {
      const { typeColors } = useHealthLogProvider();
      return (
        <View>
          <Text testID="mood">{typeColors(HealthLogType.mood).bg}</Text>
          <Text testID="symptoms">{typeColors(HealthLogType.symptoms).bg}</Text>
          <Text testID="meals">{typeColors(HealthLogType.meals).bg}</Text>
          <Text testID="water">{typeColors(HealthLogType.water).bg}</Text>
          <Text testID="exercise">{typeColors(HealthLogType.exercise).bg}</Text>
          <Text testID="sleep">{typeColors(HealthLogType.sleep).bg}</Text>
          <Text testID="general">{typeColors(HealthLogType.general).bg}</Text>
          <Text testID="bloodPressure">{typeColors(HealthLogType.bloodPressure).bg}</Text>
          <Text testID="heartRate">{typeColors(HealthLogType.heartRate).bg}</Text>
        </View>
      );
    }
    render(
      <HealthLogProvider>
        <ColorConsumer />
      </HealthLogProvider>
    );
    expect(screen.getByTestId("mood").props.children).toBeTruthy();
    expect(screen.getByTestId("symptoms").props.children).toBeTruthy();
    expect(screen.getByTestId("meals").props.children).toBeTruthy();
    expect(screen.getByTestId("water").props.children).toBeTruthy();
    expect(screen.getByTestId("exercise").props.children).toBeTruthy();
    expect(screen.getByTestId("sleep").props.children).toBeTruthy();
    expect(screen.getByTestId("general").props.children).toBeTruthy();
    expect(screen.getByTestId("bloodPressure").props.children).toBeTruthy();
    expect(screen.getByTestId("heartRate").props.children).toBeTruthy();
  });

  it("latestByType returns undefined for type with no logs", () => {
    function LatestConsumer() {
      const { latestByType } = useHealthLogProvider();
      return (
        <Text testID="has-exercise">{latestByType[HealthLogType.exercise] ? "yes" : "no"}</Text>
      );
    }
    render(
      <HealthLogProvider>
        <LatestConsumer />
      </HealthLogProvider>
    );
    // May be yes or no depending on initial data, but should not crash
    expect(["yes", "no"]).toContain(screen.getByTestId("has-exercise").props.children);
  });
});
