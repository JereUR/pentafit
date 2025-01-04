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

const NavBar = ({ user }: { user: User | null }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center shadow-lg bg-card'>
      <Logo />
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navegación y opciones de usuario
            </SheetDescription>
            <div className="mt-4 flex flex-col gap-4">
              <Navigation user={user} isMobile={true} onItemClick={() => setIsOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="hidden lg:block">
        <Navigation user={user} isMobile={false} />
      </div>
    </header>
  )
}

const Logo = () => (
  <Link href='/' className='py-2 px-4 lg:py-4 lg:px-12'>
    <Image src={logoImage} alt='Logo image' width={80} height={25} className='transition-transform duration-300 hover:scale-105 lg:w-[110px] lg:h-[35px]' />
  </Link>
)

const Navigation = ({ user, isMobile, onItemClick }: { user: User | null, isMobile: boolean, onItemClick?: () => void }) => (
  <div className={`p-4 flex ${isMobile ? 'flex-col' : 'gap-5'} items-center`}>
    {user ? (
      <AuthenticatedNav isMobile={isMobile} onItemClick={onItemClick} />
    ) : (
      <UnauthenticatedNav isMobile={isMobile} onItemClick={onItemClick} />
    )}
  </div>
)

const AuthenticatedNav = ({ isMobile, onItemClick }: { isMobile: boolean, onItemClick?: () => void }) => (
  <div className={`flex ${isMobile ? 'flex-col w-full items-center' : 'gap-5'} items-center text-white`}>
    <Link href={'/panel-de-control'} onClick={onItemClick} className={isMobile ? 'w-full' : ''}>
      <Button className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md ${isMobile ? 'w-full justify-center mb-2' : ''}`}>
        <FileChartColumn /> Panel de control
      </Button>
    </Link>
    <form action={logout} className={isMobile ? 'w-full' : ''}>
      <Button type="submit" className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-md ${isMobile ? 'w-full justify-center' : ''}`}>
        <LogOut /> Cerrar sesión
      </Button>
    </form>
  </div>
)

const UnauthenticatedNav = ({ isMobile, onItemClick }: { isMobile: boolean, onItemClick?: () => void }) => (
  <div className={`flex ${isMobile ? 'flex-col w-full items-center' : 'gap-5'} items-center text-white`}>
    <Link href={'/iniciar-sesion'} onClick={onItemClick} className={isMobile ? 'w-full' : ''}>
      <Button className={`bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md ${isMobile ? 'w-full justify-center' : ''}`}>
        Iniciar Sesión
      </Button>
    </Link>
  </div>
)

export default NavBar

