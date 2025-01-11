import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export const usePageTitle = (userName?: string) => {
  const pathname = usePathname()
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const pathnameParts = pathname.split("/").filter(Boolean)
    const pathnameArray: string[] = []
    const userPage = pathname.includes("/usuarios")

    if (userName && userPage) {
      setTitle(`Usuarios - ${userName}`)
    } else if (userName && !userPage) {
      setTitle(`Actualizar Membresía - ${userName}`)
    } else if (pathnameParts.length > 0) {
      pathnameParts.forEach((part) => {
        const capitalizedWord = part.charAt(0).toUpperCase() + part.slice(1)
        pathnameArray.push(capitalizedWord.replaceAll(/-/g, " "))
      })
      setTitle(pathnameArray.join(" - "))
    } else {
      setTitle("Panel de Control")
    }

    setIsLoading(false)
  }, [pathname, userName])

  return { title, isLoading }
}
