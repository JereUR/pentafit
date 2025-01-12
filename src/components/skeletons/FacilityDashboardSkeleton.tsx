import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function FacilitiesDashboardSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
        <Skeleton className="h-10 w-full sm:w-48" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((index) => (
          <FacilityItemSkeleton key={index} />
        ))}
      </CardContent>
    </Card>
  )
}

function FacilityItemSkeleton() {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Skeleton className="h-16 w-16 sm:h-10 sm:w-10 rounded-full" />
        <div className="flex-1 w-full sm:w-auto">
          <Skeleton className="h-6 w-full sm:w-3/4 mb-2" />
          <Skeleton className="h-4 w-3/4 sm:w-1/2" />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <Skeleton className="h-10 w-full sm:flex-1" />
          <Skeleton className="h-10 w-full sm:w-24" />
          <Skeleton className="h-10 w-full sm:w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

