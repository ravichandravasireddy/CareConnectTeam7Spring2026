import React from "react";
import { renderHook, waitFor } from "@testing-library/react-native";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { useColorScheme } from "@/hooks/use-color-scheme";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe("useColorScheme", () => {
  it("returns light or dark from ThemeProvider", async () => {
    const { result } = renderHook(() => useColorScheme(), { wrapper });
    await waitFor(() => {
      expect(["light", "dark"]).toContain(result.current);
    });
  });
});
