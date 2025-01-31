'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { FacilityAllInfo } from "@/types/facility"
import { Skeleton } from '@/components/ui/skeleton'
import { GeneralInfoTab } from "./GeneralInfoTab"
import { CustomizationTab } from "./CustomizationTab"

interface FacilityDetailsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  data: FacilityAllInfo
  isLoading: boolean
  error: Error | null
}

export function FacilityDetailsDialog({
  isOpen,
  onOpenChange,
  data,
  isLoading,
  error
}: FacilityDetailsDialogProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col justify-start h-[600px] md:h-[750px] sm:max-w-[625px] overflow-y-auto scrollbar-thin rounded-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">{data?.name || 'Detalles del establecimiento'}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : error ? (
          <div className="text-red-500 p-4 bg-red-100 rounded-md">Error al cargar los detalles: {error.message}</div>
        ) : data ? (
          <Card className="bg-card">
            <CardContent className="p-6">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="general" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Información General</TabsTrigger>
                  <TabsTrigger value="customization" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Personalización</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                  <GeneralInfoTab facility={data} />
                </TabsContent>
                <TabsContent value="customization">
                  <CustomizationTab facility={data} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
