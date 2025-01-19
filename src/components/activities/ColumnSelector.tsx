import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ActivityData } from "@/types/activity"

interface ColumnSelectorProps {
  columns: { key: keyof ActivityData; label: string }[]
  visibleColumns: Set<keyof ActivityData>
  onToggleColumn: (column: keyof ActivityData) => void
}

export default function ColumnSelector({ columns, visibleColumns, onToggleColumn }: ColumnSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">Columnas</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {columns.map((column) => (
          <DropdownMenuItem key={column.key} asChild>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={visibleColumns.has(column.key)}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => onToggleColumn(column.key)}
              />
              <span>{column.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
        <Button
          className="w-full mt-2"
          onClick={() => setIsDropdownOpen(false)}
        >
          Cerrar
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
