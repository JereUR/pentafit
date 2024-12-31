import Link from 'next/link'
import Image from 'next/image'

import { validateRequest } from '@/auth'
import { Button } from '@/components/ui/button'
import { logout } from '../(auth)/action'
import logoImage from '@/assets/logo-full.webp'

export default async function NavBar() {
  const { user } = await validateRequest()
  return (
    <header className='sticky top-0 z-50 flex justify-between items-center bg-background'>
      <Link href='/' className='py-4 px-12'>
        <Image src={logoImage} alt='Logo image' width={110} height={35} />
      </Link>
      <div className='p-4'>
        {user ? (
          <div className="flex gap-5 items-center">
            <Link href={'/panel-de-control'}><Button>Panel de control</Button></Link>
            <Button onClick={logout} className='bg-destructive hover:bg-destructive/70'>Cerrar sesión</Button>
          </div>
        ) :
          <div className="flex gap-5 items-center">
            <Link href={'/iniciar-sesion'}>
              <Button>Iniciar Sesión</Button>
            </Link>
          </div>
        }
      </div>
    </header>
  )
}
