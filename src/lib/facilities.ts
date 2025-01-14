import { cache } from "react"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { FacilityValues } from "@/lib/validation"

export const getFacilityById = cache(
  async (id: string): Promise<FacilityValues & { id: string }> => {
    try {
      const facility = await prisma.facility.findUnique({
        where: { id },
        include: { metadata: true },
      })

      if (!facility) {
        notFound()
      }

      return {
        id: facility.id,
        name: facility.name,
        description: facility.description || "",
        email: facility.email || "",
        address: facility.address || "",
        phone: facility.phone || "",
        instagram: facility.instagram || "",
        facebook: facility.facebook || "",
        logoUrl: facility.logoUrl || "",
        metadata: {
          title: facility.metadata?.title || "",
          slogan: facility.metadata?.slogan || "",
          primaryColor: facility.metadata?.primaryColor || "",
          secondaryColor: facility.metadata?.secondaryColor || "",
          thirdColor: facility.metadata?.thirdColor || "",
          logoWebUrl: facility.metadata?.logoWebUrl || "",
        },
      }
    } catch (error) {
      console.error("Error fetching facility:", error)
      throw new Error("Failed to fetch facility")
    }
  },
)
