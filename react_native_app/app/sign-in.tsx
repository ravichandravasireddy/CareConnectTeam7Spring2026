import { useRouter } from "expo-router";
import SignInScreen from "@/screens/SignInScreen";
import { UserRole } from "@/providers/UserProvider";

export default function SignInRoute() {
  const router = useRouter();

  const handleSignInSuccess = (role: UserRole) => {
    // Navigate to the appropriate dashboard based on role
    if (role === "patient") {
      router.replace("/patient" as any);
    } else {
      router.replace("/caregiver" as any);
    }
  };

  return (
    <SignInScreen
      onNavigateBack={() => router.back()}
      onNavigateToRegistration={() => router.push("/role-selection")}
      onSignInSuccess={handleSignInSuccess}
    />
  );
}
