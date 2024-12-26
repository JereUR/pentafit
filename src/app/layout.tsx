import type { Metadata } from "next"
import { Nunito } from 'next/font/google'

import "./globals.css"

const nunito = Nunito({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900', '1000'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: "%s | Pentafit",
    default: "Pentafit"
  },
  description: "Potencia tu gimnasio con Pentafit. Software de gestión integral para optimizar tus operaciones, aumentar la satisfacción de tus clientes y hacer crecer tu negocio.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={nunito.className}
      >
        {children}
      </body>
    </html>
  )
}
