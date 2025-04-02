import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsSkeleton({ primaryColor }: { primaryColor?: string }) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="flex items-center gap-4 p-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              <Skeleton className="h-10 w-10 rounded-full" style={colorStyle} />
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow space-y-2">
            <Skeleton className="h-4 w-2/3" style={colorStyle} />
            <Skeleton className="h-3 w-1/2" style={colorStyle} />
          </div>
          <Badge variant="outline">
            <Skeleton className="h-5 w-5" style={colorStyle} />
          </Badge>
        </Card>
      ))}
    </div>
  )
}

