'use client'

import { User } from 'lucia'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const publicRoutes = ['/', '/iniciar-sesion', '/registrarse', '/recuperar-contrasena', '/reestablecer-contrasena']

export function ClientAuthCheck({ user, children }: { user: User | null, children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/iniciar-sesion')
    }
  }, [user, pathname, router])

  return <>{children}</>
}

