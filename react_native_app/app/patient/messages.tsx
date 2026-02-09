import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/providers/UserProvider";
import MessagingThreadDoctorScreen from "@/screens/MessagingThreadDoctorScreen";
import MessagingThreadPatientScreen from "@/screens/MessagingThreadPatientScreen";

export default function PatientMessagesScreen() {
  const router = useRouter();
  const { isPatient } = useUser();

  const handlers = {
    onBack: () => router.back(),
    onCall: () => Alert.alert("Phone Call", "Coming soon."),
    onVideo: () => Alert.alert("Video Call", "Coming soon."),
  };

  if (isPatient) {
    return <MessagingThreadPatientScreen {...handlers} />;
  }
  return <MessagingThreadDoctorScreen {...handlers} />;
}
