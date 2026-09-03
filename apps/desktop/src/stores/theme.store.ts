import { create } from "zustand";

export type ThemeType = "midnight" | "deepspace" | "emerald" | "cyber";

type ThemeState = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

const THEME_STORAGE_KEY = "career_companion_theme";

const getInitialTheme = (): ThemeType => {
  const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeType;
  return saved || "midnight";
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    set({ theme });
  },
}));
