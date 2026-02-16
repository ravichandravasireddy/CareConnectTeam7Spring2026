/**
 * E2E Test: Login → Dashboard flow
 * Assignment 6: "E2E tests - Full user journeys from start to finish - Detox (React Native)"
 *
 * Run after building: detox test --configuration ios.sim.debug
 */
import { by, element, expect } from "detox";

describe("Login to Dashboard E2E", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should show welcome screen on app launch", async () => {
    await expect(element(by.text("CareConnect"))).toBeVisible();
    await expect(element(by.text("Get Started"))).toBeVisible();
  });

  it("should navigate to role selection when Get Started is tapped", async () => {
    await element(by.text("Get Started")).tap();
    await expect(element(by.text("Choose Your Role"))).toBeVisible();
  });

  it("should navigate to caregiver dashboard when Caregiver is selected", async () => {
    await element(by.text("Get Started")).tap();
    await element(by.text("Caregiver")).tap();
    await expect(element(by.text("Dashboard"))).toBeVisible();
  });

  it("should navigate to task details when a task card is tapped", async () => {
    await element(by.text("Get Started")).tap();
    await element(by.text("Caregiver")).tap();
    await waitFor(element(by.text("Take medication")))
      .toBeVisible()
      .withTimeout(5000);
    await element(by.text("Take medication")).tap();
    await expect(element(by.text("Task Details"))).toBeVisible();
  });
});
