'use client'

import { useEffect, useState } from 'react'
import { CalendarIcon } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

export default function WeeklyCalendarViewSkeleton({ primaryColor }: { primaryColor: string }) {
  const [colorStyle, setColorStyle] = useState({})

  useEffect(() => {
    if (primaryColor) {
      setColorStyle({ backgroundColor: `${primaryColor}20` })
    }
  }, [primaryColor])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Cargando calendario...
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="hidden sm:grid grid-cols-7 gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`skeleton-header-${i}`} className="text-center">
              <Skeleton className="h-5 w-20 mx-auto mb-1" />
              <Skeleton className="h-6 w-6 rounded-full mx-auto" />
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`skeleton-day-${i}`} className="border rounded-md p-2 h-[200px]">
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <Skeleton key={`skeleton-event-${i}-${j}`} className="h-12 rounded" style={colorStyle} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="sm:hidden space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`mobile-skeleton-${i}`} className="border rounded-md overflow-hidden">
              <div className="p-2 flex justify-between items-center bg-muted/30">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="p-2">
                <div className="space-y-2">
                  {Array.from({ length: 2 }).map((_, j) => (
                    <Skeleton key={`mobile-skeleton-event-${i}-${j}`} className="h-12 rounded" style={colorStyle} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}