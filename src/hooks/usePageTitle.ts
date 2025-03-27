"use client"

import { useState, useEffect } from "react"
import { usePathname, useParams } from "next/navigation"

export const usePageTitle = (userName?: string) => {
  const pathname = usePathname()
  const params = useParams()
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const pathnameParts = pathname.split("/").filter(Boolean)

    const isIdLike = (str: string) => {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      const numericIdPattern = /^\d+$/
      return uuidPattern.test(str) || numericIdPattern.test(str)
    }

    const paramValues = Object.values(params) as string[]

    const filteredParts = pathnameParts.filter(
      (part) => !isIdLike(part) && !paramValues.includes(part),
    )

    const adminUserPage = pathname.includes("/usuario")
    const clientUserPage = pathname.includes("/mi-perfil")
    const membershipPage = pathname.includes("/actualizar-membresia")

    if (userName && adminUserPage) {
      setTitle(`Usuario - ${userName}`)
    } else if (userName && clientUserPage) {
      setTitle(`Mi Perfil - ${userName}`)
    } else if (userName && membershipPage) {
      setTitle(`Actualizar Membresía - ${userName}`)
    } else if (filteredParts.length > 0) {
      const formattedParts = filteredParts.map((part) => {
        const capitalizedWord = part.charAt(0).toUpperCase() + part.slice(1)
        return capitalizedWord.replaceAll(/-/g, " ")
      })

      setTitle(formattedParts.join(" - "))
    } else {
      setTitle("Panel de Control")
    }

    setIsLoading(false)
  }, [pathname, userName, params])

  return { title, isLoading }
}
