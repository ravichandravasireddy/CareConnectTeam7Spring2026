import { useRouter } from "expo-router";
import PatientProfileScreen from "@/screens/PatientProfileScreen";
import { useUser } from "@/providers/UserProvider";

export default function PatientProfileScreenRoute() {
  const router = useRouter();
  const { userRole, setUserRole, setUserInfo } = useUser();

  const handleSignOut = () => {
    // Clear user info
    setUserInfo(null, null);
    setUserRole("caregiver"); // Reset to default
    router.replace("/index" as any);
  };

  return (
    <PatientProfileScreen
      onBack={() => router.back()}
      onPreferencesPress={() => router.push("/preferences-accessibility")}
      onSignOut={handleSignOut}
    />
  );
}
