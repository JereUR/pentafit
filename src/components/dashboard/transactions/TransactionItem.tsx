"use client"

import type React from "react"

import { Info, Share2, UserCheck, UserX, Copy } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import noAvatarSrc from "@/assets/avatar-placeholder.png"
import type { Transaction } from "@/types/transactions"
import type { UserClient } from "@/types/user"
import { TransactionIcon } from "./TransactionIcon"
import { TransactionBadge } from "./TransactionBadge"
import {
  getTransactionType,
  getTransactionName,
  isUserTransaction,
  getFormattedDate,
  getReplicationInfo,
  getAssignmentInfo,
  getUnassignmentInfo,
  getConversionInfo,
} from "./TransactionUtils"

interface TransactionItemProps {
  transaction: Transaction
  isLast: boolean
  onShowFacilities: (facilities: Array<{ id: string; name: string; logoUrl?: string }>) => void
  onShowUsers: (users: UserClient[]) => void
}

export function TransactionItem({ transaction, isLast, onShowFacilities, onShowUsers }: TransactionItemProps) {
  const replicationInfo = getReplicationInfo(transaction)
  const assignmentInfo = getAssignmentInfo(transaction)
  const unassignmentInfo = getUnassignmentInfo(transaction)
  const conversionInfo = getConversionInfo(transaction)

  const transactionName = getTransactionName(transaction)
  const transactionType = getTransactionType(transaction.type)
  const formattedDate = getFormattedDate(transaction.createdAt)

  return (
    <div>
      <div className="py-3">
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
          <div className="flex items-center col-span-1">
            {isUserTransaction(transaction.type) ? (
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={transaction.targetUser?.avatarUrl || noAvatarSrc.src} alt={transactionName} />
                <AvatarFallback>
                  {transaction.targetUser
                    ? `${transaction.targetUser.firstName[0]}${transaction.targetUser.lastName[0]}`
                    : transactionName[0]}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <TransactionIcon type={transaction.type} />
              </div>
            )}
            <div className="ml-4 space-y-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none truncate">{transactionName}</p>
                {replicationInfo && (
                  <TransactionInfoBadge
                    icon={<Share2 className="h-3 w-3" />}
                    count={replicationInfo.count}
                    onClick={() => onShowFacilities(replicationInfo.facilities)}
                  />
                )}
                {assignmentInfo && (
                  <TransactionInfoBadge
                    icon={<UserCheck className="h-3 w-3" />}
                    count={assignmentInfo.assignedCount}
                    onClick={() => onShowUsers(assignmentInfo.assignedUsers)}
                  />
                )}
                {unassignmentInfo && (
                  <TransactionInfoBadge
                    icon={<UserX className="h-3 w-3" />}
                    count={unassignmentInfo.unassignedCount}
                    onClick={() => onShowUsers(unassignmentInfo.unassignedUsers)}
                  />
                )}
                {conversionInfo && (
                  <Badge variant="outline" className="ml-2 flex items-center gap-1">
                    <Copy className="h-3 w-3" />
                    <span className="max-w-[100px] truncate">{conversionInfo.presetName}</span>
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                <span className="font-medium">{transactionType}</span> - Por {transaction.performedBy.firstName}{" "}
                {transaction.performedBy.lastName}
              </p>
            </div>
          </div>
          <div className="flex items-center sm:justify-center">
            <TransactionBadge type={transaction.type} />
          </div>
          <div className="flex items-center sm:justify-end">
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </div>
        </div>
      </div>
      {!isLast && <Separator className="my-2" />}
    </div>
  )
}

interface TransactionInfoBadgeProps {
  icon: React.ReactNode
  count: number
  onClick: () => void
}

function TransactionInfoBadge({ icon, count, onClick }: TransactionInfoBadgeProps) {
  return (
    <div className="flex items-center">
      <Badge variant="outline" className="ml-2 flex items-center gap-1">
        {icon}
        <span>{count}</span>
      </Badge>
      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={onClick}>
        <Info className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

