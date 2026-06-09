"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme";

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme: string }) {
  const { setTheme } = useThemeStore();

  useEffect(() => {
    // Sincronizar el tema inicial desde la cookie
    setTheme(initialTheme);
  }, [initialTheme, setTheme]);

  return <>{children}</>;
}
