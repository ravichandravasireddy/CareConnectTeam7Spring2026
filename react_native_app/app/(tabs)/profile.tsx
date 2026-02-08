import { useRouter } from "expo-router";
import PatientProfileScreen from "@/screens/PatientProfileScreen";

export default function ProfileTab() {
  const router = useRouter();

  return (
    <PatientProfileScreen
      onBack={() => router.push("/(tabs)/home")}
      onPreferencesPress={() => router.push("/preferences-accessibility")}
      onSignOut={() => router.replace("/sign-in")}
    />
  );
}
