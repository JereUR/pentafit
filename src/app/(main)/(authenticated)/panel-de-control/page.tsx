import { Metadata } from "next"

import Dashboard from "@/components/dashboard/Dashboard"

export const metadata: Metadata = {
  title: "Panel de control",
}

export default function DashboardPage() {
  return (
    <main className="flex container gap-5 p-5">
      <Dashboard />
    </main>
  )
}
