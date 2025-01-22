import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col items-start gap-4 mb-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex flex-col md:flex-row md:justify-between gap-2 w-full">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <Skeleton className="h-10 w-80 md:w-64" />
            <Skeleton className="h-10 w-80 md:w-24" />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <Skeleton className="h-10 w-80 md:w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="w-[90vw] md:w-[80vw] h-[40vh] mx-auto" />
      <div className="flex justify-between items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}
