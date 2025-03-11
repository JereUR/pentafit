import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TransactionSkeleton } from "./TransactionSkeleton"

export function TransactionListSkeleton() {
  return (
    <Card className="h-full border-primary flex flex-col">
      <CardHeader className="flex-none">
        <CardTitle>Últimas Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6 overflow-auto">
        <TransactionSkeleton count={8} />
      </CardContent>
    </Card>
  )
}

