import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { DiaryPlanData } from "@/types/plan"
import { daysOfWeek } from "@/lib/utils"

interface DiaryPlansDialogProps {
  diaryPlans: DiaryPlanData[]
}

export function DiaryPlansDialog({ diaryPlans }: DiaryPlansDialogProps) {
  return (
    <div className="max-h-[60vh] overflow-auto scrollbar-thin">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-2/12 md:w-1/4 text-center whitespace-normal">Nombre de actividad</TableHead>
            <TableHead className="w-8/12 md:w-1/2 text-center whitespace-normal">Días de la semana</TableHead>
            <TableHead className="w-2/12 md:w-1/4 text-center whitespace-normal">Máximo de sesiones por semana</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {diaryPlans.map((diaryPlan) => (
            <TableRow key={diaryPlan.id}>
              <TableCell className="text-center">{diaryPlan.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap justify-center gap-2">
                  {diaryPlan.daysOfWeek.map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <span className="text-xs font-medium">{daysOfWeek[index]}</span>
                      <Checkbox checked={day} disabled className="mt-1" />
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-center">{diaryPlan.sessionsPerWeek}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

