"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { ProgressDataPoint, ProgressType } from "@/types/progress"

interface ProgressChartProps {
  data: Record<string, ProgressDataPoint[]>
  primaryColor: string
  showLegend?: boolean
  showTooltip?: boolean
}

export function ProgressChart({ data, primaryColor, showLegend = false, showTooltip = false }: ProgressChartProps) {
  if (!data) return null

  const chartData = prepareChartData(data)

  const colors: Record<ProgressType, string> = {
    EXERCISE_COMPLETION: primaryColor,
    NUTRITION_ADHERENCE: "#22c55e",
    CLASS_ATTENDANCE: "#3b82f6",
    WEIGHT_TRACKING: "#f97316",
    MEASUREMENT: "#8b5cf6",
  }

  const typeNames: Record<ProgressType, string> = {
    EXERCISE_COMPLETION: "Rutina",
    NUTRITION_ADHERENCE: "Nutrición",
    CLASS_ATTENDANCE: "Clases",
    WEIGHT_TRACKING: "Peso",
    MEASUREMENT: "Medidas",
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(new Date(date), "d MMM", { locale: es })}
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} tickFormatter={(value) => `${value}%`} />
        {showTooltip && (
          <Tooltip
            formatter={(value) => [`${value}%`, ""]}
            labelFormatter={(date) => format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })}
          />
        )}
        {showLegend && <Legend formatter={(value) => typeNames[value as ProgressType] || value} />}

        {Object.keys(data).map((type) => (
          <Line
            key={type}
            type="monotone"
            dataKey={type}
            stroke={colors[type as ProgressType] || primaryColor}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

function prepareChartData(data: Record<string, ProgressDataPoint[]>) {
  const allDates = new Set<string>()

  Object.values(data).forEach((progressArray) => {
    progressArray.forEach((item) => {
      allDates.add(new Date(item.date).toISOString().split("T")[0])
    })
  })

  const sortedDates = Array.from(allDates).sort()

  return sortedDates.map((dateStr) => {
    const result: Record<string, string | number | null> = { date: dateStr }

    Object.entries(data).forEach(([type, progressArray]) => {
      const matchingItem = progressArray.find((item) => new Date(item.date).toISOString().split("T")[0] === dateStr)

      result[type] = matchingItem ? matchingItem.value : null
    })

    return result
  })
}
