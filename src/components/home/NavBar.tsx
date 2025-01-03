import { User } from 'lucia'
import Link from 'next/link'
import Image from 'next/image'
import { FileChartColumn, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import logoImage from '@/assets/logo-full.webp'
import { logout } from '@/app/(auth)/action'
import { validateRequest } from '@/auth'

const NavBar = async () => {
  const { user } = await validateRequest()

  return (
    <header className='sticky top-0 z-50 flex justify-between items-center shadow-lg bg-card'>
      <Logo />
      <Navigation user={user} />
    </header>
  )
}

const Logo = () => (
  <Link href='/' className='py-4 px-12'>
    <Image src={logoImage} alt='Logo image' width={110} height={35} className='transition-transform duration-300 hover:scale-105' />
  </Link>
)

const Navigation = ({ user }: { user: User | null }) => (
  <div className='p-4 flex gap-5 items-center'>
    {user ? <AuthenticatedNav /> : <UnauthenticatedNav />}
  </div>
)

const AuthenticatedNav = () => (
  <div className="flex gap-5 items-center text-white">
    <Link href={'/panel-de-control'}>
      <Button className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 shadow-md'>
        <FileChartColumn /> Panel de control
      </Button>
    </Link>
    <Button onClick={logout} className='flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors duration-300 shadow-md'>
      <LogOut /> Cerrar sesión
    </Button>
  </div>
)

const UnauthenticatedNav = () => (
  <div className="flex gap-5 items-center text-white">
    <Link href={'/iniciar-sesion'}>
      <Button className='bg-green-600 hover:bg-green-700 transition-colors duration-300 shadow-md'>
        Iniciar Sesión
      </Button>
    </Link>
  </div>
)

export default NavBar