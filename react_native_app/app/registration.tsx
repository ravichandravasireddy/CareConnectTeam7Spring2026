import { useLocalSearchParams, useRouter } from "expo-router";
import RegistrationScreen from "@/screens/RegistrationScreen";
import { UserRole } from "@/providers/UserProvider";

export default function RegistrationRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const roleParam = params.role === "caregiver" ? "caregiver" : "patient";

  const handleRegistrationSuccess = (role: UserRole) => {
    // Navigate to the appropriate dashboard based on role
    if (role === "patient") {
      router.replace("/patient" as any);
    } else {
      router.replace("/caregiver" as any);
    }
  };

  return (
    <RegistrationScreen
      selectedRole={roleParam as UserRole}
      onNavigateBack={() => router.back()}
      onNavigateToSignIn={() => router.push("/sign-in")}
      onRegistrationSuccess={handleRegistrationSuccess}
    />
  );
}
