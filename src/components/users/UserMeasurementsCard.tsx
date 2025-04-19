"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Scale, ChevronDown, ChevronUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UserMeasurement } from "@/types/user"

interface UserMeasurementsCardProps {
  measurements: UserMeasurement[]
  primaryColor?: string
}

export function UserMeasurementsCard({ measurements, primaryColor }: UserMeasurementsCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!measurements || measurements.length === 0) {
    return null
  }

  const latestMeasurement = measurements[0]

  const chartData = measurements
    .slice()
    .reverse()
    .map((measurement) => ({
      date: format(new Date(measurement.date), "dd/MM/yy"),
      weight: measurement.weight,
      bodyFat: measurement.bodyFat,
      muscle: measurement.muscle,
      chest: measurement.chest,
      waist: measurement.waist,
      hips: measurement.hips,
      arms: measurement.arms,
      thighs: measurement.thighs,
    }))

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md mt-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Mis Medidas</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="text-muted-foreground" />
            <span className="font-medium">Última medición:</span>
            <span>{format(new Date(latestMeasurement.date), "dd 'de' MMMM, yyyy", { locale: es })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {latestMeasurement.weight && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Peso</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {latestMeasurement.weight} kg
              </div>
            </div>
          )}
          {latestMeasurement.height && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Altura</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {latestMeasurement.height} cm
              </div>
            </div>
          )}
          {latestMeasurement.bodyFat && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Grasa Corporal</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {latestMeasurement.bodyFat}%
              </div>
            </div>
          )}
          {latestMeasurement.muscle && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">Masa Muscular</div>
              <div className="text-xl font-bold" style={{ color: primaryColor }}>
                {latestMeasurement.muscle}%
              </div>
            </div>
          )}
        </div>

        {isExpanded && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {latestMeasurement.chest && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Pecho</div>
                  <div className="text-lg font-bold">{latestMeasurement.chest} cm</div>
                </div>
              )}
              {latestMeasurement.waist && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Cintura</div>
                  <div className="text-lg font-bold">{latestMeasurement.waist} cm</div>
                </div>
              )}
              {latestMeasurement.hips && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Cadera</div>
                  <div className="text-lg font-bold">{latestMeasurement.hips} cm</div>
                </div>
              )}
              {latestMeasurement.arms && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Brazos</div>
                  <div className="text-lg font-bold">{latestMeasurement.arms} cm</div>
                </div>
              )}
              {latestMeasurement.thighs && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <div className="text-sm text-muted-foreground">Muslos</div>
                  <div className="text-lg font-bold">{latestMeasurement.thighs} cm</div>
                </div>
              )}
            </div>

            {measurements.length > 1 && (
              <div className="mt-6">
                <h4 className="font-semibold text-lg mb-4">Progreso</h4>
                <Tabs defaultValue="weight">
                  <TabsList className="mb-4">
                    {latestMeasurement.weight && <TabsTrigger value="weight">Peso</TabsTrigger>}
                    {latestMeasurement.bodyFat && <TabsTrigger value="bodyFat">Grasa Corporal</TabsTrigger>}
                    {latestMeasurement.muscle && <TabsTrigger value="muscle">Masa Muscular</TabsTrigger>}
                    {latestMeasurement.waist && <TabsTrigger value="measurements">Medidas</TabsTrigger>}
                  </TabsList>

                  {latestMeasurement.weight && (
                    <TabsContent value="weight">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="weight"
                              name="Peso (kg)"
                              stroke={primaryColor || "#F97015"}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  )}

                  {latestMeasurement.bodyFat && (
                    <TabsContent value="bodyFat">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="bodyFat"
                              name="Grasa Corporal (%)"
                              stroke={primaryColor || "#F97015"}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  )}

                  {latestMeasurement.muscle && (
                    <TabsContent value="muscle">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="muscle"
                              name="Masa Muscular (%)"
                              stroke={primaryColor || "#F97015"}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  )}

                  {latestMeasurement.waist && (
                    <TabsContent value="measurements">
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {latestMeasurement.chest && (
                              <Line type="monotone" dataKey="chest" name="Pecho (cm)" stroke="#8884d8" />
                            )}
                            {latestMeasurement.waist && (
                              <Line type="monotone" dataKey="waist" name="Cintura (cm)" stroke={primaryColor || "#F97015"} />
                            )}
                            {latestMeasurement.hips && (
                              <Line type="monotone" dataKey="hips" name="Cadera (cm)" stroke="#82ca9d" />
                            )}
                            {latestMeasurement.arms && (
                              <Line type="monotone" dataKey="arms" name="Brazos (cm)" stroke="#ffc658" />
                            )}
                            {latestMeasurement.thighs && (
                              <Line type="monotone" dataKey="thighs" name="Muslos (cm)" stroke="#ff8042" />
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            )}

            {latestMeasurement.notes && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-2">Notas</h4>
                <p className="text-muted-foreground">{latestMeasurement.notes}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
