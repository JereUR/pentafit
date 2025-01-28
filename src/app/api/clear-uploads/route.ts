import { UTApi } from "uploadthing/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const utapi = new UTApi()

export const GET = async (req: Request) => {
  try {
    const authHeader = req.headers.get("Authorization")

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response(
        JSON.stringify({ message: "Encabezado de autorización no válido." }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const allFiles = await utapi.listFiles()

    const usedUrls = await prisma.$queryRaw<{ url: string }[]>`
      SELECT "avatarUrl" as url FROM "users" WHERE "avatarUrl" IS NOT NULL
      UNION ALL
      SELECT "logoUrl" as url FROM "facilities" WHERE "logoUrl" IS NOT NULL
      UNION ALL
      SELECT "logoWebUrl" as url FROM "facility_metadata" WHERE "logoWebUrl" IS NOT NULL
    `

    const orphanedFiles = allFiles.files.filter(
      (file) => !usedUrls.some((usedUrl) => usedUrl.url.includes(file.key)),
    )

    if (orphanedFiles.length > 0) {
      await utapi.deleteFiles(orphanedFiles.map((file) => file.key))
      console.log(`Se eliminaron ${orphanedFiles.length} archivos huérfanos`)
    } else {
      console.log("No se encontraron archivos huérfanos")
    }

    return new Response(
      JSON.stringify({ success: true, deletedCount: orphanedFiles.length }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error al limpiar archivos huérfanos:", error)
    return new Response(
      JSON.stringify({ error: "Error Interno del Servidor." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
