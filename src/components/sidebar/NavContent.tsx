import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { navItems } from '@/config/nav'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { NavItemComponent } from './NavItemComponente'

interface NavContentProps {
  isExpanded: boolean
  onExpandedChange: (expanded: boolean) => void
}

export function NavContent({ isExpanded, onExpandedChange }: NavContentProps) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [isDark, setIsDark] = useState(false)

  const toggleSubmenu = (title: string) => {
    setOpenItems(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      <div className="flex h-20 items-center border-b md:px-4">
        <Logo isExpanded={isExpanded} />
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden lg:flex"
          onClick={() => onExpandedChange(!isExpanded)}
        >
          {isExpanded ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <NavItemComponent
            key={item.title}
            item={item}
            isExpanded={isExpanded}
            isOpen={openItems[item.title]}
            onToggle={() => toggleSubmenu(item.title)}
          />
        ))}
      </nav>
      <div className="border-t p-4">
        <ThemeToggle
          isDark={isDark}
          isExpanded={isExpanded}
          onToggle={toggleTheme}
        />
      </div>
    </>
  )
}

