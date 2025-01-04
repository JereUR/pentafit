'use client'

import { usePathname } from 'next/navigation'

import UserButton from '../UserButton'

export default function TopBar() {
  const pathname = usePathname()
  let title = 'Panel de Control'
  const pathnameParts = pathname.split('/')
  pathnameParts.shift()

  const pathnameArray: string[] = []

  if (pathnameParts.length > 1) {
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
    <div className='sticky top-0 z-30 flex justify-between items-center shadow-md p-4 w-full transition-all duration-300 ease-in-out bg-background'>
      <div className="text-foreground font-bold capitalize text-2xl ml-2">
        {title}
      </div>
      <div className="flex items-center gap-5 md:mr-8">
        <UserButton />
      </div>
    </div>
  )
}

