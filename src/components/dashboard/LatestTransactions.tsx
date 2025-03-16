"use client"

import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInfiniteTransactions } from "@/hooks/useInfiniteTransactions"
import { TransactionList } from "./TransactionList"
import { FacilityReplicationDialog } from "./FacilityReplicationDialog"
import { TransactionListSkeleton } from "../skeletons/TransactionListSkeleton"
import { TransactionWithDetails } from "@/types/transactions"
import { UserAssignmentDialog } from "./UserAssignmentDialog"
import { UserClient } from "@/types/user"

interface LatestTransactionsProps {
  facilityId: string
}

export function LatestTransactions({ facilityId }: LatestTransactionsProps) {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } =
    useInfiniteTransactions(facilityId)

  const [selectedFacilities, setSelectedFacilities] = useState<Array<{ id: string; name: string; logoUrl?: string }>>(
    [],
  )
  const [selectedUsers, setSelectedUsers] = useState<UserClient[]>([])
  const [isDialogFacilityOpen, setIsDialogFacilityOpen] = useState(false)
  const [isDialogUserOpen, setIsDialogUserOpen] = useState(false)

  const transactions = data?.pages.flatMap((page) => page.transactions) || []

  const handleShowFacilities = (facilities: Array<{ id: string; name: string; logoUrl?: string }>) => {
    setSelectedFacilities(facilities)
    setIsDialogFacilityOpen(true)
  }

  const handleShowUsers = (users: UserClient[]) => {
    setSelectedUsers(users)
    setIsDialogUserOpen(true)
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
            onShowUsers={handleShowUsers}
            onLoadMore={() => hasNextPage && !isFetching && fetchNextPage()}
          />
        </div>
      </CardContent>
      <FacilityReplicationDialog
        isOpen={isDialogFacilityOpen}
        onClose={() => setIsDialogFacilityOpen(false)}
        facilities={selectedFacilities}
      />
      <UserAssignmentDialog
        isOpen={isDialogUserOpen}
        onClose={() => setIsDialogUserOpen(false)}
        users={selectedUsers}
      />
    </Card>
  )
}

