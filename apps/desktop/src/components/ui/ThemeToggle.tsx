import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "./button";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon-sm" : "icon"}
      onClick={toggleTheme}
      className={className}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

export default ThemeToggle;
