"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useThemeStore } from "@/store/theme";

const fetchJson = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || "Error inesperado");
  }

  return res.json();
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore();

  const { data: settings } = useQuery<{ id: string; theme: string }>({
    queryKey: ["settings"],
    queryFn: () => fetchJson("/api/settings"),
  });

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings, setTheme]);

  return <>{children}</>;
}
