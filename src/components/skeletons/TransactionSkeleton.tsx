import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface TransactionSkeletonProps {
  count?: number
}

export function TransactionSkeleton({ count = 5 }: TransactionSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <div className="py-3">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
              <div className="flex items-center col-span-1">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />

                <div className="ml-4 space-y-1 overflow-hidden w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24 sm:w-32" />
                  </div>
                  <Skeleton className="h-4 w-40 sm:w-48" />
                </div>
              </div>
              <div className="flex items-center sm:justify-center">
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex items-center sm:justify-end">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
          {index < count - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  )
}

