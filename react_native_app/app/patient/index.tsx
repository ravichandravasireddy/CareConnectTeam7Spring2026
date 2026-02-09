import { useState } from "react";
import { useRouter } from "expo-router";
import PatientDashboardScreen from "@/screens/PatientDashboardScreen";
import { AppMenu } from "@/components/app-menu";

export default function PatientHomeScreen() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <>
      <PatientDashboardScreen
        userName="Robert Williams"
        onNotificationsPress={() =>
          router.push("/notifications" as any)
        }
        onMenuPress={() => setMenuVisible(true)}
        onCalendarPress={() => router.push("/calendar" as any)}
        onHealthLogsPress={() => router.push("/health-logs" as any)}
        onTaskDetailsPress={(taskId) => router.push({
          pathname: "/task-details",
          params: { taskId },
        } as any)}
        onVideoCallPress={() => router.push("/video-call" as any)}
        onMessagingPress={() => router.push("/patient/messages" as any)}
        onEmergencyPress={() => router.push("/emergency-sos" as any)}
      />
      <AppMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
