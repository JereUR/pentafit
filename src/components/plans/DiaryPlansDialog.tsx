import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { DiaryPlanData } from "@/types/plan"
import { daysOfWeek } from "@/lib/utils"

interface DiaryPlansDialogProps {
  diaryPlans: DiaryPlanData[]
}

export function DiaryPlansDialog({ diaryPlans }: DiaryPlansDialogProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre de actividad</TableHead>
          <TableHead>Días de la semana</TableHead>
          <TableHead>Máximo de sesiones por semana</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {diaryPlans.map((diaryPlan) => (
          <TableRow key={diaryPlan.id}>
            <TableCell>{diaryPlan.activityName}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {diaryPlan.daysOfWeek.map((day, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="text-xs font-medium">{daysOfWeek[index]}</span>
                    <Checkbox checked={day} disabled className="mt-1" />
                  </div>
                ))}
              </div>
            </TableCell>
            <TableCell>{diaryPlan.sessionsPerWeek}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

