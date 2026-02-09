import { Alert } from "react-native";
import { useRouter } from "expo-router";
import MessagingThreadPatientScreen from "@/screens/MessagingThreadPatientScreen";

export default function PatientMessagesScreen() {
  const router = useRouter();

  return (
    <MessagingThreadPatientScreen
      onBack={() => router.back()}
      onCall={() => Alert.alert("Phone Call", "Coming soon.")}
      onVideo={() => Alert.alert("Video Call", "Coming soon.")}
    />
  );
}
