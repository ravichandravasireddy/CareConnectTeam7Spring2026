import { useLocalSearchParams, useRouter } from "expo-router";
import RegistrationScreen from "@/screens/RegistrationScreen";

type UserRole = "patient" | "caregiver";

export default function RegistrationRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string }>();
  const roleParam = params.role === "caregiver" ? "caregiver" : "patient";

  return (
    <RegistrationScreen
      selectedRole={roleParam as UserRole}
      onNavigateBack={() => router.back()}
      onNavigateToSignIn={() => router.push("/sign-in")}
      onRegistrationSuccess={() => router.replace("/(tabs)/home")}
    />
  );
}
