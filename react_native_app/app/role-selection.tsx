import { useRouter } from "expo-router";
import RoleSelectionScreen from "@/screens/RoleSelectionScreen";

export default function RoleSelectionRoute() {
  const router = useRouter();

  return (
    <RoleSelectionScreen
      onNavigateBack={() => router.back()}
      onSelectRole={(role) =>
        router.push({ pathname: "/registration", params: { role } })
      }
    />
  );
}
