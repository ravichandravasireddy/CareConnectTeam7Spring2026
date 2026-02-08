import { useRouter } from "expo-router";
import SignInScreen from "@/screens/SignInScreen";

export default function SignInRoute() {
  const router = useRouter();

  return (
    <SignInScreen
      onNavigateBack={() => router.back()}
      onNavigateToRegistration={() => router.push("/registration")}
      onSignInSuccess={() => router.replace("/(tabs)/home")}
    />
  );
}
