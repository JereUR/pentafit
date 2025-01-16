import { Skeleton } from "@/components/ui/skeleton"

export function WorkingFacilitySkeleton() {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='h-5 w-5/6 mx-auto' />
      <div className='flex items-center gap-4 ml-1'>
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className='h-7 w-40' />
      </div>
    </div>
  )
}

