import { Skeleton } from "@/components/ui/skeleton"

export function ProgressSkeleton({ primaryColor }: { primaryColor: string }) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-6 w-48 mb-2" style={colorStyle} />
          <Skeleton className="h-4 w-64" style={colorStyle} />
        </div>
        <Skeleton className="h-10 w-40" style={colorStyle} />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-[400px]" style={colorStyle} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[180px] w-full" style={colorStyle} />
          ))}
        </div>

        <Skeleton className="h-[300px] w-full" style={colorStyle} />
      </div>
    </div>
  )
}
