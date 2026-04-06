import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
      className="rounded-full w-10 h-10 glass border border-white/5 hover:border-primary/40 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-500 group"
    >
      <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all duration-700 dark:-rotate-90 dark:scale-0 text-primary group-hover:scale-110" />
      <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all duration-700 dark:rotate-0 dark:scale-100 text-primary group-hover:scale-110" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

