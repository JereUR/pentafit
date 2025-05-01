import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
  type TooltipProps,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import type { ProgressDataPoint, ProgressType } from "@/types/progress"

interface ProgressChartProps {
  data: Record<string, ProgressDataPoint[]>
  primaryColor: string
  showLegend?: boolean
  showTooltip?: boolean
  theme?: string
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
    name: string
  }>
  label?: string
}

type FormatterType = (value: number | null) => string

export function ProgressChart({
  data,
  primaryColor,
  showLegend = true,
  showTooltip = true,
  theme = "dark"
}: ProgressChartProps) {
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
    EXERCISE_COMPLETION: "Rutina de ejercicios",
    NUTRITION_ADHERENCE: "Plan nutricional",
    CLASS_ATTENDANCE: "Asistencia a clases",
    WEIGHT_TRACKING: "Control de peso",
    MEASUREMENT: "Medidas corporales",
  }

  const renderCustomLegend = () => {
    if (!showLegend) return null

    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4 mb-2">
        {Object.keys(data).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[type as ProgressType] || primaryColor }}
            />
            <span className="text-sm font-medium">{typeNames[type as ProgressType] || type}</span>
          </div>
        ))}
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium text-sm mb-1">
            {label ? format(new Date(label), "EEEE, d 'de' MMMM", { locale: es }) : ""}
          </p>
          <div className="space-y-1">
            {payload.map(
              (entry, index) =>
                entry.value !== null && (
                  <div key={`item-${index}`} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                    <p className="text-xs">
                      <span className="font-medium">{typeNames[entry.dataKey as ProgressType] || entry.dataKey}:</span>{" "}
                      <span>{Math.round(entry.value)}%</span>
                    </p>
                  </div>
                ),
            )}
          </div>
        </div>
      )
    }
    return null
  }

  const labelFormatter: FormatterType = (value) => (value !== null ? `${Math.round(value)}%` : "")
  const axisColor = theme === "dark" ? "#ffffff" : "#000000"

  return (
    <>
      {renderCustomLegend()}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 40, right: 30, left: 20, bottom: 70 }}
          barGap={8}
          barCategoryGap={24}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "d MMM", { locale: es })}
            stroke={axisColor}
            fontSize={12}
            tickMargin={15}
            axisLine={{ stroke: axisColor, strokeWidth: 1 }}
            tick={{ fill: axisColor }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            domain={[0, 100]}
            stroke={axisColor}
            fontSize={12}
            tickFormatter={(value) => `${value}%`}
            axisLine={{ stroke: axisColor, strokeWidth: 1 }}
            tick={{ fill: axisColor }}
            tickMargin={10}
          />
          <ReferenceLine y={50} stroke="#e5e7eb" strokeDasharray="3 3" />
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />}
          {Object.keys(data).map((type) => (
            <Bar
              key={type}
              dataKey={type}
              fill={colors[type as ProgressType] || primaryColor}
              radius={[4, 4, 0, 0]}
              name={typeNames[type as ProgressType] || type}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-in-out"
              barSize={30}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[type as ProgressType] || primaryColor}
                  opacity={entry[type] === null ? 0.3 : 1}
                />
              ))}
              <LabelList
                dataKey={type}
                position="top"
                formatter={labelFormatter}
                style={{ fontSize: "10px", fill: "#ffffff" }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </>
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

  const limitedDates = sortedDates.length > 14 ? sortedDates.slice(-14) : sortedDates

  return limitedDates.map((dateStr) => {
    const dateObj = new Date(dateStr)
    const formattedDate = format(dateObj, "d MMM", { locale: es })

    const result: Record<string, string | number | null> = {
      date: dateStr,
      formattedDate: formattedDate,
      dateLabel: format(dateObj, "EEEE, d 'de' MMMM", { locale: es }),
    }

    Object.entries(data).forEach(([type, progressArray]) => {
      const matchingItem = progressArray.find((item) => new Date(item.date).toISOString().split("T")[0] === dateStr)

      result[type] = matchingItem ? matchingItem.value : null
    })

    return result
  })
}