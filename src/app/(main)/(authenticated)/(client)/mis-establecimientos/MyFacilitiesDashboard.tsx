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
    <div className="w-full max-w-7xl mx-8 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {facilities.map((facility) => (
          <Link
            href={`/${facility.id}/inicio`}
            key={facility.id}
            className="transition-all hover:scale-[1.02] focus:scale-[1.02] focus:outline-none hover:shadow-lg"
          >
            <Card
              className="h-full overflow-hidden rounded-xl transition-colors"
              style={{ borderColor: facility.primaryColor }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-semibold text-gray-800">{facility.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div
                  className="relative h-40 w-full bg-gray-50 rounded-lg overflow-hidden"
                  style={{ borderColor: facility.primaryColor }}
                >
                  {facility.logoUrl ? (
                    <Image
                      src={facility.logoUrl}
                      alt={`Logo de ${facility.name}`}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gray-100">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full group font-medium transition-colors hover:brightness-95"
                  style={{ backgroundColor: facility.primaryColor }}
                >
                  <span className="group-hover:underline">Ir a establecimiento</span>
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