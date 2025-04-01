"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  isExpanded: boolean
  primaryColor?: string
}

export function ThemeToggle({ isExpanded, primaryColor }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const textPrimaryStyle = primaryColor ? { color: primaryColor } : undefined

  const getBgPrimaryStyle = (opacity = "80") => {
    if (!primaryColor) return undefined
    return {
      backgroundColor: `${primaryColor}${opacity === "100" ? "" : opacity}`,
    }
  }

  const ringPrimaryStyle = primaryColor
    ? {
      boxShadow: `0 0 0 2px ${primaryColor}`,
    }
    : undefined

  if (!isExpanded) {
    return (
      <button
        className={`h-10 w-10 rounded-full bg-card-foreground/80 shadow-sm dark:bg-primary-foreground flex items-center justify-center ${primaryColor ? "" : "text-primary dark:text-primary"
          }`}
        style={textPrimaryStyle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun size={18} className={primaryColor ? "text-foreground" : "text-primary"} />
        ) : (
          <Moon size={18} className={primaryColor ? "text-foreground" : "text-primary"} />
        )}
      </button>
    )
  }

  return (
    <motion.button
      className={`relative h-[40px] w-[90px] rounded-full p-2 shadow-inner focus:outline-none ${primaryColor
          ? ""
          : "bg-primary/80 hover:bg-primary/20 focus:ring-2 focus:ring-primary dark:bg-primary/20 dark:hover:bg-primary/30"
        }`}
      style={{
        ...getBgPrimaryStyle(theme === "dark" ? "20" : "80"),
        ...ringPrimaryStyle,
      }}
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`absolute flex top-[5px] h-[30px] w-[30px] items-center justify-center rounded-full bg-card-foreground/80 shadow-sm ${primaryColor ? "" : "text-primary dark:bg-primary-foreground dark:text-primary"
          }`}
        style={{
          ...textPrimaryStyle,
          ...(theme === "dark" && primaryColor ? { backgroundColor: primaryColor } : {}),
        }}
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
        animate={{
          x: theme === "dark" ? 5 : 43,
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: theme === "dark" ? 320 : 15,
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30,
          }}
        >
          {theme === "dark" ? (
            <Sun size={18} className={primaryColor ? "text-foreground" : "text-primary"} />
          ) : (
            <Moon size={18} className={primaryColor ? "text-foreground" : "text-primary"} />
          )}
        </motion.div>
      </motion.div>
      <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
    </motion.button>
  )
}

