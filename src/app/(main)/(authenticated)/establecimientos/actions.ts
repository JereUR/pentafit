"use server"

import { revalidatePath } from "next/cache"
import { FacilityValues } from "@/lib/validation"
import prisma from "@/lib/prisma"

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
