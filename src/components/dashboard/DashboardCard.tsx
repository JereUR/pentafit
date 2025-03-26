"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  id: number
  title: string
  icon: React.ReactNode
  value: number | undefined
  loading: boolean
  error: Error | null
  className?: string
}

export function DashboardCard({ id, title, icon, value, loading, error, className }: DashboardCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true)
      },
      100 + id * 50,
    )

    return () => clearTimeout(timer)
  }, [id])

  const cardVariants = [
    "from-blue-600/30 to-indigo-600/30 hover:from-blue-600/40 hover:to-indigo-600/40",
    "from-purple-600/30 to-pink-600/30 hover:from-purple-600/40 hover:to-pink-600/40",
    "from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40",
    "from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40",
    "from-rose-600/30 to-red-600/30 hover:from-rose-600/40 hover:to-red-600/40",
    "from-cyan-600/30 to-sky-600/30 hover:from-cyan-600/40 hover:to-sky-600/40",
    "from-lime-600/30 to-green-600/30 hover:from-lime-600/40 hover:to-green-600/40",
    "from-yellow-600/30 to-green-500/30 hover:from-yellow-600/40 hover:to-green-500/40",
  ]

  const iconColors = [
    "text-blue-400",
    "text-purple-400",
    "text-amber-400",
    "text-emerald-400",
    "text-rose-400",
    "text-cyan-400",
    "text-lime-400",
    "text-yellow-400",
  ]

  if (error) {
    return (
      <Card
        className={cn(
          "w-full overflow-hidden relative transition-all duration-300 ease-in-out",
          "border border-destructive/50 shadow-lg",
          "opacity-0 translate-y-4",
          isVisible && "opacity-100 translate-y-0",
          className,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/20" />
        <div className="relative p-3 md:p-5 h-[90px] md:h-[130px] flex flex-col justify-between z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative w-7 h-7 md:w-9 md:h-9">
              <div className="absolute inset-0 rounded-full bg-destructive/10" />
              <div className="absolute inset-0 flex items-center justify-center text-destructive">
                <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {icon}
                </div>
              </div>
            </div>
            <h3 className="font-medium text-xs md:text-base">{title}</h3>
          </div>
          <div className="mt-1 md:mt-2 text-center">
            <p className="text-destructive text-sm md:text-base font-medium">Error al cargar datos</p>
          </div>
        </div>
      </Card>
    )
  }

  const cardVariant = cardVariants[id % cardVariants.length]
  const iconColor = iconColors[id % iconColors.length]

  return (
    <Card
      className={cn(
        "w-full overflow-hidden relative transition-all duration-300 ease-in-out",
        "border-0 shadow-lg hover:shadow-xl",
        "opacity-0 translate-y-4",
        isVisible && "opacity-100 translate-y-0",
        className,
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br transition-all duration-300", cardVariant)} />
      <div className="relative p-3 md:p-5 h-[90px] md:h-[130px] flex flex-col justify-between z-10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center bg-background rounded-full">
            <div
              className={cn(
                "w-4 h-4 md:w-5 md:h-5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full",
                iconColor,
              )}
            >
              {icon}
            </div>
          </div>
          <h3 className="font-medium text-xs md:text-base">{title}</h3>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-8 md:h-12">
            <Loader2 className={cn("animate-spin w-5 h-5 md:w-6 md:h-6", iconColor)} />
          </div>
        ) : (
          <div className="flex justify-center mt-1 md:mt-2">
            <span className={cn("text-2xl md:text-4xl font-bold transition-all duration-500", iconColor)}>
              {value || 0}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

