import Link from "next/link"
import { Edit } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"
import Image from "next/image"

import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TeamData, columnsTeam } from "@/types/team"
import { cn, formatBirthday } from "@/lib/utils"
import { DeleteConfirmationDialog } from "../DeleteConfirmationDialog"
import { useToast } from "@/hooks/use-toast"
import UserAvatar from "../UserAvatar"
import noImage from '@/assets/avatar-placeholder.png'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface TeamRowProps {
  member: TeamData
  index: number
  visibleColumns: Set<keyof TeamData>
  isSelected: boolean
  onToggleRow: (id: string) => void
  deleteMember: UseMutateFunction<{
    facilityId: string;
    success: boolean;
    message: string;
    deletedCount: number;
} | {
    facilityId: string;
    success: boolean;
    message: string;
    deletedCount?: undefined;
}, Error, {
    memberIds: string | string[];
    facilityId: string;
}, unknown>
  isDeleting: boolean
}

export default function TeamRow({
  member,
  index,
  visibleColumns,
  isSelected,
  onToggleRow,
  deleteMember,
  isDeleting
}: TeamRowProps) {

  const { toast } = useToast()

  const handleDelete = () => {
    deleteMember({ memberIds: member.id, facilityId: member.facilityId }, {
      onError: (error) => {
        toast({
          variant: "destructive",
          title: "Error al eliminar el establecimiento",
          description: error.message,
        })
      },
    })
  }

  return (
    <TableRow
      className={cn(
        isSelected ? 'bg-primary/40 dark:bg-primary/20' : index % 2 === 0 ? 'bg-card/40' : 'bg-muted/20'
      )}
    >
      <TableCell className="p-0 w-[50px] text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleRow(member.id)}
        />
      </TableCell>
      {columnsTeam
        .filter((col) => visibleColumns.has(col.key))
        .map((column) => (
          <TableCell key={column.key} className="border-x text-center break-words">
            {column.key === "birthday" ? (
              formatBirthday(member[column.key].toString())
            ) : column.key === "avatarUrl" ? (
              <UserAvatar avatarUrl={member[column.key] as string} size={32} className='flex justify-center' />
            ) : column.key === "facilities" ? (
              <div className="flex justify-center space-x-1">
                {(member[column.key] as { id: string; name: string; logoUrl: string }[]).map((facility) => (
                  <TooltipProvider key={facility.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Image
                          src={facility.logoUrl || noImage}
                          alt={facility.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{facility.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            ) : (
              member[column.key]?.toString() || "-"
            )}
          </TableCell>
        ))}
      <TableCell className="text-center">
        <div className="flex flex-col items-center-center gap-2 text-xs md:text-sm">
          <Button asChild variant="outline" className="w-full break-words" onClick={(e) => e.stopPropagation()}>
            <Link href={`/equipo/editar/${member.id}`}>
              <Edit className="h-4 w-4" /> Editar
            </Link>
          </Button>
          <DeleteConfirmationDialog
            itemName={`al integrante ${member.firstName} ${member.lastName}`}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}
