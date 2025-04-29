// MyPaymentsContent.tsx
"use client"

import { CreditCard, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClientFacility } from "@/contexts/ClientFacilityContext"
import PaymentsView from "./PaymentsView"
import InvoicesView from "./InvoicesView"
import { Card } from "../ui/card"

export default function MyPaymentsContent({ facilityId }: { facilityId: string }) {
  const { primaryColor } = useClientFacility()

  return (
    <div>
      <div className="sm:hidden mb-6">
        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="payments"
              className="flex items-center gap-2 data-[state=active]:bg-[var(--tab-color)] data-[state=active]:text-white rounded-md"
              style={{ ['--tab-color' as string]: primaryColor }}
            >
              <CreditCard className="h-4 w-4" />
              <span>Pagos</span>
            </TabsTrigger>

            <TabsTrigger
              value="invoices"
              className="flex items-center gap-2 data-[state=active]:bg-[var(--tab-color)] data-[state=active]:text-white rounded-md"
              style={{ ['--tab-color' as string]: primaryColor }}
            >
              <FileText className="h-4 w-4" />
              <span>Facturas</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="payments" className="mt-4">
            <PaymentsView facilityId={facilityId} primaryColor={primaryColor} />
          </TabsContent>
          <TabsContent value="invoices" className="mt-4">
            <InvoicesView facilityId={facilityId} primaryColor={primaryColor} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-6 max-h-[100vh] sm:overflow-hidden">
        <Card className="p-2 lg:p-4 overflow-y-auto scrollbar-thin">
          <div className="sticky top-0 bg-background z-10 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5" style={{ color: primaryColor }} />
              <h2 className="text-lg font-semibold">Mis Pagos</h2>
            </div>
          </div>
          <PaymentsView facilityId={facilityId} primaryColor={primaryColor} />
        </Card>
        <Card className="p-2 lg:p-4 overflow-y-auto scrollbar-thin">
          <div className="sticky top-0 bg-background z-10 pb-2">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5" style={{ color: primaryColor }} />
              <h2 className="text-lg font-semibold">Mis Facturas</h2>
            </div>
          </div>
          <InvoicesView facilityId={facilityId} primaryColor={primaryColor} />
        </Card>
      </div>
    </div>
  )
}