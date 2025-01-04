import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de control",
}
export default function DashboardPage() {
  return (
    <div className="p-6">
      <p>Bienvenido al Panel de Control</p>
    </div>
  )
}
