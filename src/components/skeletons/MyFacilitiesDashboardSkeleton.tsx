import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MyFacilitiesDashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      <Skeleton className="h-8 w-48 rounded-md" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-full overflow-hidden border border-primary/10 rounded-xl">
            <CardHeader className="pb-3">
              <Skeleton className="h-6 w-3/4 rounded-md" />
            </CardHeader>
            <CardContent className="pb-4">
              <Skeleton className="h-40 w-full rounded-lg" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full rounded-md bg-primary/20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}