'use client'

import { Building2, Loader2 } from 'lucide-react'

import { useFacilities } from "@/hooks/useFacilities"
import { Card, CardContent } from '../ui/card'
import WorkingFacility from '../WorkingFacility'

export default function Dashboard({ userId }: { userId: string }) {
  const { facilities, isLoading: isLoadingFacilities, error: facilitiesError } = useFacilities(userId)

  return (
    <div className='flex justify-between px-10 w-full'>
      <div className='hidden md:inline'>
        <DashboardCard id={0} title='Establecimientos activos' icon={<Building2 className='h-8 w-8 mr-4' />} value={facilities?.filter(f => f.isActive).length} loading={isLoadingFacilities} error={facilitiesError} />
      </div>
      <WorkingFacility userId={userId} />
    </div>
  )
}

interface DashboardContentProps {
  id: number
  title: string,
  icon: React.ReactNode,
  value: number | undefined,
  loading: boolean
  error: Error | null
}

export function DashboardCard({ id, title, icon, value, loading, error }: DashboardContentProps) {

  if (error) {
    return (
      <Card
        key={id}
        className="w-[300px] h-[150px] border-2 border-primary shadow-md"
      >
        <CardContent className="flex flex-col justify-between h-full p-4">
          <div className='flex w-full items-center gap-4 text-primary'>
            {icon}
            <span className="md:text-xl font-bold text-center">{title}</span>
          </div>
          <div className="flex justify-center items-end mt-2">
            <span className="text-lg font-semibold text-foreground">Error al cargar datos</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      key={id}
      className="w-[250px] h-[120px] border-primary shadow-md"
    >
      <CardContent className="flex flex-col justify-between h-full p-4">
        <div className='flex items-center gap-2 text-primary'>
          {icon}
          <span className="md:text-xl font-bold">{title}</span>
        </div>
        {loading ? <Loader2 className='mx-auto animate-spin' /> : <div className="flex justify-center items-end">
          <span className="text-2xl md:text-3xl font-semibold text-foreground">{value || 0}</span>
        </div>}
      </CardContent>
    </Card>
  )
}

