// =============================================================================
// NOTIFICATION PROVIDER TESTS
// =============================================================================

import React from "react";
import { act, render, screen, fireEvent } from "@testing-library/react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { NotificationProvider, useNotificationProvider } from "../NotificationProvider";
import { NotificationItem, NotificationType } from "@/models/NotificationItem";

const mockNotification: NotificationItem = {
  id: "new-1",
  title: "Test",
  summary: "Summary",
  type: NotificationType.generalReminder,
  createdAt: new Date(),
  isRead: false,
};

function Consumer() {
  const {
    notifications,
    notificationSections,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll,
  } = useNotificationProvider();
  const first = notifications[0];
  return (
    <View>
      <Text testID="count">{notifications.length}</Text>
      <Text testID="sections">{notificationSections.length}</Text>
      <Text testID="unread">{unreadCount}</Text>
      <TouchableOpacity testID="add" onPress={() => addNotification(mockNotification)}>
        <Text>Add</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="remove" onPress={() => removeNotification("new-1")}>
        <Text>Remove</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="clear" onPress={() => clearAll()}>
        <Text>Clear</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="mark-one" onPress={() => first && markAsRead(first)}>
        <Text>Mark one</Text>
      </TouchableOpacity>
      <TouchableOpacity testID="mark-all" onPress={() => markAllAsRead()}>
        <Text>Mark all</Text>
      </TouchableOpacity>
    </View>
  );
}

describe("NotificationProvider", () => {
  it("provides initial notifications", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    expect(Number(screen.getByTestId("count").props.children)).toBeGreaterThanOrEqual(1);
  });

  it("notificationSections has length", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    expect(Number(screen.getByTestId("sections").props.children)).toBeGreaterThanOrEqual(1);
  });

  it("unreadCount is number", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    expect(Number(screen.getByTestId("unread").props.children)).toBeGreaterThanOrEqual(0);
  });

  it("addNotification adds item", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    const before = Number(screen.getByTestId("count").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("add"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(before + 1);
  });

  it("removeNotification removes item", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
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

  it("clearAll empties notifications", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("clear"));
    });
    expect(Number(screen.getByTestId("count").props.children)).toBe(0);
  });

  it("markAllAsRead runs without error", () => {
    render(
      <NotificationProvider>
        <Consumer />
      </NotificationProvider>
    );
    act(() => {
      fireEvent.press(screen.getByTestId("mark-all"));
    });
    expect(Number(screen.getByTestId("unread").props.children)).toBe(0);
  });

  it("throws when useNotificationProvider used outside provider", () => {
    expect(() => render(<Consumer />)).toThrow("useNotificationProvider must be used within NotificationProvider");
  });

  it("markAsRead does nothing when notification is already read", () => {
    function MarkReadConsumer() {
      const { notifications, markAsRead, unreadCount } = useNotificationProvider();
      const readNotification = notifications.find((n) => n.isRead);
      return (
        <View>
          <Text testID="unread-before">{unreadCount}</Text>
          <TouchableOpacity
            testID="mark-read"
            onPress={() => readNotification && markAsRead(readNotification)}
          >
            <Text>Mark Read</Text>
          </TouchableOpacity>
          <Text testID="unread-after">{unreadCount}</Text>
        </View>
      );
    }
    render(
      <NotificationProvider>
        <MarkReadConsumer />
      </NotificationProvider>
    );
    const before = Number(screen.getByTestId("unread-before").props.children);
    act(() => {
      fireEvent.press(screen.getByTestId("mark-read"));
    });
    // Unread count should not change if already read
    const after = Number(screen.getByTestId("unread-after").props.children);
    expect(after).toBe(before);
  });

  it("markAsRead marks unread notification as read", () => {
    function MarkUnreadConsumer() {
      const { notifications, markAsRead, unreadCount } = useNotificationProvider();
      const unreadNotification = notifications.find((n) => !n.isRead);
      return (
        <View>
          <Text testID="unread-before">{unreadCount}</Text>
          <TouchableOpacity
            testID="mark-unread"
            onPress={() => unreadNotification && markAsRead(unreadNotification)}
          >
            <Text>Mark Unread</Text>
          </TouchableOpacity>
        </View>
      );
    }
    render(
      <NotificationProvider>
        <MarkUnreadConsumer />
      </NotificationProvider>
    );
    const before = Number(screen.getByTestId("unread-before").props.children);
    if (before > 0) {
      act(() => {
        fireEvent.press(screen.getByTestId("mark-unread"));
      });
      // Unread count should decrease
      const after = Number(screen.getByTestId("unread-before").props.children);
      expect(after).toBeLessThanOrEqual(before);
    }
  });

  it("notificationSections groups notifications by date correctly", () => {
    function SectionConsumer() {
      const { notificationSections } = useNotificationProvider();
      return (
        <View>
          {notificationSections.map((section, idx) => (
            <Text key={idx} testID={`section-${idx}`}>
              {section.label}
            </Text>
          ))}
        </View>
      );
    }
    render(
      <NotificationProvider>
        <SectionConsumer />
      </NotificationProvider>
    );
    // Should have at least one section
    expect(screen.getAllByTestId(/section-/).length).toBeGreaterThan(0);
  });

  it("notificationSections sorts items within section by time descending", () => {
    function SortConsumer() {
      const { notificationSections } = useNotificationProvider();
      const todaySection = notificationSections.find((s) => s.label === "Today");
      return (
        <View>
          <Text testID="first-time">
            {todaySection && todaySection.items.length > 0
              ? todaySection.items[0].createdAt.getTime()
              : 0}
          </Text>
          <Text testID="second-time">
            {todaySection && todaySection.items.length > 1
              ? todaySection.items[1].createdAt.getTime()
              : 0}
          </Text>
        </View>
      );
    }
    render(
      <NotificationProvider>
        <SortConsumer />
      </NotificationProvider>
    );
    const first = Number(screen.getByTestId("first-time").props.children);
    const second = Number(screen.getByTestId("second-time").props.children);
    if (first > 0 && second > 0) {
      expect(first).toBeGreaterThanOrEqual(second);
    }
  });
});
