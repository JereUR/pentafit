import { Skeleton } from "../ui/skeleton";

export function FacilityInfoSkeleton({ primaryColor }: { primaryColor?: string }) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <Skeleton className="h-8 w-1/3 rounded" style={colorStyle} />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded" style={colorStyle} />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-1/2 rounded" style={colorStyle} />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4 rounded" style={colorStyle} />
          ))}
        </div>

        <div className="space-y-4 p-6 border rounded-lg">
          <Skeleton className="h-6 w-1/2 rounded" style={colorStyle} />
          <div className="flex gap-4">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" style={colorStyle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}