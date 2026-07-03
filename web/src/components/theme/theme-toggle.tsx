import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

interface ModeToggleProps {
  className?: string;
  variant?: "icon" | "full";
}

export function ModeToggle({
  className = "",
  variant = "icon",
}: ModeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Icon-only variant for header/navbar
  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`relative border-border/40 bg-background/95 backdrop-blur hover:bg-accent hover:border-accent-foreground/20 transition-all duration-300 cursor-pointer ${className}`}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 dark:scale-0 " />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] transition-transform duration-300 scale-0 dark:scale-100 " />
      </Button>
    );
  }

  // Full-width variant for mobile sidebar
  return (
    <button
      onClick={toggleTheme}
      className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium 
        bg-accent/50 text-foreground hover:bg-accent hover:shadow-md
        transition-all duration-200 hover:scale-[1.02] ${className}`}
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/50 transition-all duration-200">
          <Sun className="h-4 w-4 transition-transform duration-300 dark:scale-0" />
          <Moon className="absolute h-4 w-4 transition-transform duration-300 scale-0 dark:scale-100" />
        </div>
        <span className="text-sm">
          {theme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`
          relative w-11 h-6 rounded-full transition-colors duration-300
          ${theme === "dark" ? "bg-primary" : "bg-muted-foreground/30"}
        `}
        >
          <div
            className={`
            absolute top-1 w-4 h-4 rounded-full bg-background shadow-md
            transition-transform duration-300
            ${theme === "dark" ? "translate-x-6" : "translate-x-1"}
          `}
          />
        </div>
      </div>
    </button>
  );
}
