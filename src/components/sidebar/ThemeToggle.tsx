'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface ThemeToggleProps {
  isExpanded: boolean
}

export function ThemeToggle({ isExpanded }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  if (!isExpanded) {
    return (
      <button
        className="h-10 w-10 rounded-full bg-card-foreground/80 text-primary shadow-sm dark:bg-primary-foreground dark:text-primary flex items-center justify-center"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    )
  }

  return (
    <motion.button
      className="relative h-[40px] w-[90px] rounded-full bg-primary/80 p-2 shadow-inner hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-primary/20 dark:hover:bg-primary/30"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute flex top-[5px] h-[30px] w-[30px] items-center justify-center rounded-full bg-card-foreground/80 text-primary shadow-sm dark:bg-primary-foreground dark:text-primary"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
        animate={{
          x: theme === 'dark' ? 5 : 43
        }}
      >
        <motion.div
          initial={false}
          animate={{
            rotate: theme === 'dark' ? 320 : 15
          }}
          transition={{
            type: "spring",
            stiffness: 700,
            damping: 30
          }}
        >
          {theme === 'dark' ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
        </motion.div>
      </motion.div>
      <span className="sr-only">{theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</span>
    </motion.button>
  )
}
