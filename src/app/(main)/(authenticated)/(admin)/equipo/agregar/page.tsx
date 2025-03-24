import { Metadata } from "next"
import { Suspense } from "react"
import { ChevronLeft, Loader2 } from 'lucide-react'
import Link from "next/link"

import { validateRequest } from "@/auth"
import { Button } from "@/components/ui/button"
import MemberForm from "@/components/team/MemberForm"

export const metadata: Metadata = {
  title: "Agregar integrante",
  description: "Agrega un nuevo integrante a tu equipo"
}

export default async function AddMemberPage() {
  const { user } = await validateRequest()

  if (!user) return null

  return (
    <main className="relative container py-8">
      <Button variant='ghost' className='absolute -top-2 md:top-11 left-0 md:left-2 border border-input'>
        <Link href='/equipo' className='flex items-center gap-1'>
          <ChevronLeft /> Volver
        </Link>
      </Button>
      <section className="w-full mx-auto">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <MemberFormWrapper userId={user.id} />
        </Suspense>
      </section>
    </main>
  )
}

function MemberFormWrapper({ userId }: { userId: string }) {
  return (
    <MemberForm userId={userId} />
  )
}
