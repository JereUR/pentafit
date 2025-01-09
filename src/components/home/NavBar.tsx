'use client'

import { User } from 'lucia'
import Link from 'next/link'
import Image from 'next/image'
import { FileBarChartIcon as FileChartColumn, LogOut, Menu } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import logoImage from '@/assets/logo-full.webp'
import { logout } from '@/app/(auth)/action'
import { ThemeToggle } from '../ThemeToggle'

const NavBar = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center shadow-lg bg-card'>
      <Logo />
      <div className="flex items-center">
        <div className="hidden lg:flex items-end h-full mr-8 p-4">
          <Navigation user={user} isMobile={false} />
          <div className="mx-4 h-16 w-px bg-border self-center" aria-hidden="true" />
          <ThemeToggle isExpanded={true} />
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle isExpanded={false} />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className='sr-only'>Menu</SheetTitle>
              <SheetDescription className='sr-only'>
                Navegación y opciones de usuario
              </SheetDescription>
              <div className="mt-4 flex flex-col gap-4">
                <Navigation user={user} isMobile={true} onItemClick={() => setIsOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

const Logo = () => (
  <Link href='/' className='py-4 px-12'>
    <Image src={logoImage} alt='Logo image' width={110} height={35} className='transition-transform duration-300 hover:scale-105' />
  </Link>
)

const Navigation = ({ user, isMobile, onItemClick }: { user: User | null, isMobile: boolean, onItemClick?: () => void }) => (
  <div className={`flex ${isMobile ? 'flex-col' : 'gap-5'} items-center`}>
    {user ? (
      <AuthenticatedNav name={user.firstName} isMobile={isMobile} onItemClick={onItemClick} />
    ) : (
      <UnauthenticatedNav isMobile={isMobile} onItemClick={onItemClick} />
    )}
  </div>
)

const AuthenticatedNav = ({ name, isMobile, onItemClick }: { name: string, isMobile: boolean, onItemClick?: () => void }) => (
  <div className='flex flex-col items-center gap-2'>
    <p className="italic font-semibold text-foreground"> Hola, <span className="text-primary">{name}</span>! </p>
    <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} items-center gap-3`}>
      <Link
        href="/panel-de-control"
        onClick={onItemClick}
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50 
          bg-primary text-primary-foreground hover:bg-primary/90 
          h-10 px-4 py-2 ${isMobile ? 'w-full' : ''}
        `}
      >
        <FileChartColumn className="mr-2 h-4 w-4" />
        Panel de control
      </Link>
      <form action={logout} className={isMobile ? 'w-full' : ''}>
        <button
          type="submit"
          className={`
            inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
            disabled:pointer-events-none disabled:opacity-50 
            border border-input bg-background hover:bg-accent hover:text-accent-foreground 
            h-10 px-4 py-2 ${isMobile ? 'w-full' : ''}
          `}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </button>
      </form>
    </div>
  </div>
)

const UnauthenticatedNav = ({ isMobile, onItemClick }: { isMobile: boolean, onItemClick?: () => void }) => (
  <div className={`flex ${isMobile ? 'flex-col w-full' : 'flex-row'} items-center gap-3`}>
    <Link
      href="/iniciar-sesion"
      onClick={onItemClick}
      className={`
        inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:pointer-events-none disabled:opacity-50 
        bg-primary text-primary-foreground hover:bg-primary/90 
        h-10 px-4 py-2 ${isMobile ? 'w-full' : ''}
      `}
    >
      Iniciar Sesión
    </Link>
  </div>
)

export default NavBar

