'use client'

import type { User } from "lucia"
import Link from "next/link"
import Image from "next/image"
import { Building2, ArrowRight } from "lucide-react"

import { useUserFacilities } from "@/hooks/useUserFacilities"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import MyFacilitiesDashboardSkeleton from "@/components/skeletons/MyFacilitiesDashboardSkeleton"

interface MyFacilitiesDashboardProps {
  user: User
}

export default function MyFacilitiesDashboard({ user }: MyFacilitiesDashboardProps) {
  const { data: facilities, isLoading: isLoadingFacilities } = useUserFacilities(user.id)

  if (isLoadingFacilities) return <MyFacilitiesDashboardSkeleton />

  if (!facilities || facilities.length === 0) {
    return (
      <div className="w-full mx-auto space-y-8">
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <Building2 className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No tienes establecimientos asignados</h2>
            <p className="text-muted-foreground">
              Contacta con el administrador para que te asigne a un establecimiento.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Link
            href={`/${facility.id}/inicio`}
            key={facility.id}
            className="transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
          >
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{facility.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative h-32 w-full bg-card rounded-md overflow-hidden">
                  {facility.logoUrl ? (
                    <Image
                      src={facility.logoUrl || "/placeholder.svg"}
                      alt={`Logo de ${facility.name}`}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Building2 className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full group" style={{ backgroundColor: facility.primaryColor }}>
                  Ir a establecimiento
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

