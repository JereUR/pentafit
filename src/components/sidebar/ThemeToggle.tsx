import { Sun, Moon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  isDark: boolean
  isExpanded: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, isExpanded, onToggle }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'w-full justify-start',
        !isExpanded && 'lg:justify-center'
      )}
      onClick={onToggle}
    >
      {isDark ? (
        <>
          <Moon className="h-5 w-5" />
          <span className={cn('ml-2', !isExpanded && 'lg:hidden')}>
            Modo oscuro
          </span>
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
          <span className={cn('ml-2', !isExpanded && 'lg:hidden')}>
            Modo claro
          </span>
        </>
      )}
    </Button>
  )
}

