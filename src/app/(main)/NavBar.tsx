import React from 'react'
import Link from 'next/link'

import { validateRequest } from '@/auth'
import { Button } from '@/components/ui/button'
import { logout } from '../(auth)/action'

export default async function NavBar() {
  const { user } = await validateRequest()
  return (
    <div>{user ? (
      <div className="flex gap-5 items-center">
        <p>Hello {user.firstName} {user.lastName}</p>
        <Button onClick={logout}>Cerrar sesión</Button>
      </div>) : <div className="flex gap-5 items-center">
      <p>Unlogged</p>
      <Link href={'/iniciar-sesion'}>Iniciar Sesión</Link>
    </div>}</div>
  )
}
