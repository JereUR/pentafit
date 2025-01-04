import prisma from "./prisma"

export async function getUserNamesById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { firstName: true, lastName: true },
    })
    return user
  } catch (error) {
    console.error("Error fetching user data:", error)
    throw error
  }
}
