import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserProfileSkeleton({ primaryColor }: { primaryColor?: string }) {
  const colorStyle = primaryColor ? { backgroundColor: `${primaryColor}20` } : {}

  return (
    <div className="container mx-auto p-4 relative">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="h-8 w-40" style={colorStyle} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <Skeleton className="w-24 h-24 rounded-full" style={colorStyle} />
            </div>
            <div>
              <Skeleton className="h-8 w-48 mb-2" style={colorStyle} />
              <Skeleton className="h-4 w-64" style={colorStyle} />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" style={colorStyle} />
            <Skeleton className="h-4 w-3/4" style={colorStyle} />
            <Skeleton className="h-4 w-1/2" style={colorStyle} />
          </div>
          <Skeleton className="h-10 w-32 mt-4" style={colorStyle} />
        </CardContent>
      </Card>
    </div>
  )
}

