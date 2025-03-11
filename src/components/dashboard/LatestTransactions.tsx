"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInfiniteTransactions } from "@/hooks/useInfiniteTransactions"
import { TransactionList } from "./TransactionList"
import type { TransactionWithDetails } from "./TransactionItem"
import { FacilityReplicationDialog } from "./FacilityReplicationDialog"
import { TransactionListSkeleton } from "../skeletons/TransactionListSkeleton"

interface LatestTransactionsProps {
  facilityId: string
}

export function LatestTransactions({ facilityId }: LatestTransactionsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteTransactions(facilityId)

  const [selectedFacilities, setSelectedFacilities] = useState<Array<{ id: string; name: string; logoUrl?: string }>>(
    [],
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const transactions = data?.pages.flatMap((page) => page.transactions) || []

  const handleShowFacilities = (facilities: Array<{ id: string; name: string; logoUrl?: string }>) => {
    setSelectedFacilities(facilities)
    setIsDialogOpen(true)
  }

  if (status === "pending") {
    return <TransactionListSkeleton />
  }

  if (status === "error") {
    return (
      <Card className="h-full border-primary">
        <CardHeader className="flex-none">
          <CardTitle>Últimas Transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error al cargar las transacciones</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-primary flex flex-col overflow-auto scrollbar-thin">
      <CardHeader className="flex-none">
        <CardTitle>Últimas Transacciones</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className="pt-2 p-4 md:pt-4 md:p-6 h-full">
          <TransactionList
            transactions={transactions as TransactionWithDetails[]}
            isLoading={isFetchingNextPage}
            onShowFacilities={handleShowFacilities}
            onLoadMore={() => hasNextPage && !isFetching && fetchNextPage()}
          />
        </div>
      </CardContent>
      <FacilityReplicationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        facilities={selectedFacilities}
      />
    </Card>
  )
}

