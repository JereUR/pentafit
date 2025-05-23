import { Menu } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export default function TopBarSkeleton({ primaryColor }: { primaryColor?: string }) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <div className="sticky top-0 z-30 flex justify-between items-center shadow-md p-5 w-full transition-all duration-300 ease-in-out bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
        <Skeleton className="h-8 w-64" style={colorStyle} />
      </div>
      <div className="flex items-center gap-5 md:mr-10">
        <Skeleton className="h-10 w-10 rounded-full" style={colorStyle} />
      </div>
    </div>
  )
}

