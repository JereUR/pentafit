import { notFound } from 'next/navigation'
import { Metadata } from "next"

import prisma from '@/lib/prisma'
import { MembershipUpdateForm } from './MembershipUpdateForm'

export const metadata: Metadata = {
  title: "Actualizar membresía",
}

interface MembershipPageProps {
  params: Promise<{ userId: string }>
}

export default async function ActualizarMembresiaPage({ params }: MembershipPageProps) {
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, firstName: true, lastName: true, membershipLevel: true }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <MembershipUpdateForm user={user} />
    </div>
  )
}

