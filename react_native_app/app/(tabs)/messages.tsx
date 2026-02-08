import { Alert } from "react-native";
import { useRouter } from "expo-router";
import MessagingThreadPatientScreen from "@/screens/MessagingThreadPatientScreen";

export default function MessagesTab() {
  const router = useRouter();

  return (
    <MessagingThreadPatientScreen
      onBack={() => router.push("/(tabs)/home")}
      onCall={() => Alert.alert("Phone Call", "Coming soon.")}
      onVideo={() => Alert.alert("Video Call", "Coming soon.")}
    />
  );
}
