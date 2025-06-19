import React from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-transparent"
    >
      <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all duration-200 dark:-rotate-90 dark:scale-0 text-orange-500" />
      <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all duration-200 dark:rotate-0 dark:scale-100 text-slate-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}