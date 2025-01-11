import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel de control",
}

export default function DashboardPage() {
  return (
    <main className="flex container gap-5 p-5">
      <p>Bienvenido al Panel de Control</p>
    </main>
  )
}
