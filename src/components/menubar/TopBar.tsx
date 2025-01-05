'use client'

import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import UserButton from '../UserButton'

interface TopBarProps {
  onMenuClick: () => void
  userName?: string
}

export default function TopBar({ onMenuClick, userName }: TopBarProps) {
  const pathname = usePathname()
  let title = 'Panel de Control'
  const pathnameParts = pathname.split('/')
  pathnameParts.shift()

  const pathnameArray: string[] = []

  if (userName) {
    title = `Usuarios - ${userName}`
  } else if (pathnameParts.length > 1) {
    pathnameParts.forEach((part) => {
      if (part) {
        if (part != 'panel-de-control') {
          const capitalizedWord = part.charAt(0).toUpperCase() + part.slice(1)
          pathnameArray.push(capitalizedWord.replaceAll(/-/g, ' '))
        }
      }
    })

    title = pathnameArray.join(' - ')
  }

  return (
    <div className='sticky top-0 z-30 flex justify-between items-center shadow-md p-5 w-full transition-all duration-300 ease-in-out bg-background'>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <div className="text-foreground font-bold capitalize text-2xl">
          {title}
        </div>
      </div>
      <div className="flex items-center gap-5 md:mr-10">
        <UserButton />
      </div>
    </div>
  )
}
