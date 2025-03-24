"use server"

import { revalidatePath } from "next/cache"
import { cache } from "react"
import { notFound } from "next/navigation"

import { FacilityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

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

export async function createFacility(userId: string, values: FacilityValues) {
  try {
    const facility = await prisma.facility.create({
      data: {
        name: values.name,
        description: values.description,
        email: values.email,
        address: values.address,
        phone: values.phone,
        instagram: values.instagram,
        facebook: values.facebook,
        logoUrl: values.logoUrl,
        metadata: {
          create: {
            title: values.metadata?.title,
            slogan: values.metadata?.slogan,
            primaryColor: values.metadata?.primaryColor,
            secondaryColor: values.metadata?.secondaryColor,
            thirdColor: values.metadata?.thirdColor,
            logoWebUrl: values.metadata?.logoWebUrl,
          },
        },
        users: {
          create: {
            userId: userId,
          },
        },
      },
    })

    revalidatePath("/establecimientos")
    return { success: true, facility }
  } catch (error) {
    console.error(error)
    return { error: "Error al crear el establecimiento" }
  }
}

export async function updateFacility(id: string, values: FacilityValues) {
  try {
    const facility = await prisma.facility.update({
      where: { id },
      data: {
        name: values.name,
        description: values.description,
        email: values.email,
        address: values.address,
        phone: values.phone,
        instagram: values.instagram,
        facebook: values.facebook,
        logoUrl: values.logoUrl,
        metadata: {
          upsert: {
            create: {
              title: values.metadata?.title,
              slogan: values.metadata?.slogan,
              primaryColor: values.metadata?.primaryColor,
              secondaryColor: values.metadata?.secondaryColor,
              thirdColor: values.metadata?.thirdColor,
              logoWebUrl: values.metadata?.logoWebUrl,
            },
            update: {
              title: values.metadata?.title,
              slogan: values.metadata?.slogan,
              primaryColor: values.metadata?.primaryColor,
              secondaryColor: values.metadata?.secondaryColor,
              thirdColor: values.metadata?.thirdColor,
              logoWebUrl: values.metadata?.logoWebUrl,
            },
          },
        },
      },
    })

    revalidatePath("/establecimientos")
    return { success: true, facility }
  } catch (error) {
    console.error(error)
    return { error: "Error al actualizar el establecimiento" }
  }
}

export async function deleteFacility(id: string) {
  try {
    await prisma.facilityMetadata.deleteMany({
      where: { facilityId: id },
    })

    await prisma.userFacility.deleteMany({
      where: { facilityId: id },
    })

    const deletedFacility = await prisma.facility.delete({
      where: { id },
    })

    if (!deletedFacility) {
      throw new Error("Establecimiento no encontrado")
    }

    revalidatePath("/establecimientos")
    return { success: true, deletedFacility }
  } catch (error) {
    console.error("Error deleting facility:", error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Error al eliminar el establecimiento" }
  }
}
