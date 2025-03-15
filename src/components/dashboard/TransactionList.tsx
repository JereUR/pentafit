"use client"

import { useEffect, useRef } from "react"

import { TransactionItem } from "./TransactionItem"
import { TransactionSkeleton } from "../skeletons/TransactionSkeleton"
import { TransactionWithDetails } from "@/types/transactions"

interface TransactionListProps {
  transactions: TransactionWithDetails[]
  isLoading: boolean
  onShowFacilities: (facilities: Array<{ id: string; name: string; logoUrl?: string }>) => void
  onLoadMore: () => void
}

export function TransactionList({ transactions, isLoading, onShowFacilities, onLoadMore }: TransactionListProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading) {
          onLoadMore()
        }
      },
      { threshold: 0.1 },
    )

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [isLoading, onLoadMore])

  if (!transactions.length && !isLoading) {
    return <p className="text-sm text-muted-foreground text-center py-4">No hay transacciones recientes</p>
  }

  return (
    <div ref={listRef} className="space-y-2">
      {transactions.map((transaction, index) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          isLast={index === transactions.length - 1}
          onShowFacilities={onShowFacilities}
        />
      ))}

      <div ref={loadingRef} className="h-4 w-full">
        {isLoading && (
          <div className="py-4">
            <TransactionSkeleton count={1} />
          </div>
        )}
      </div>
    </div>
  )
}

