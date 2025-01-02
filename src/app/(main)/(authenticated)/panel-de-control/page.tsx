import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de control",
}

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      <p>Bienvenido al Panel de Control</p>
    </div>
  )
}
