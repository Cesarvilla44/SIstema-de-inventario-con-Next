import { create } from "zustand";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "dark",
  setTheme: (theme) => {
    set({ theme });
    // Guardar en cookie
    fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    }).catch((err) => console.error("Error saving theme to cookie:", err));
    // Actualizar clase dark en el html
    const html = document.documentElement;
    if (theme === "light") {
      html.classList.remove("dark");
    } else {
      html.classList.add("dark");
    }
  },
}));
