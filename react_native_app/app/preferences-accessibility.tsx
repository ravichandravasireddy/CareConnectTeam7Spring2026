import { useRouter } from "expo-router";
import PreferencesAccessibilityScreen from "@/screens/PreferencesAccessibilityScreen";

export default function PreferencesAccessibilityRoute() {
  const router = useRouter();

  return <PreferencesAccessibilityScreen onBack={() => router.back()} />;
}
