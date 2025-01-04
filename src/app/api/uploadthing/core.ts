import { createUploadthing, FileRouter } from "uploadthing/next"
import { UploadThingError, UTApi } from "uploadthing/server"

import { validateRequest } from "@/auth"
import prisma from "@/lib/prisma"

const f = createUploadthing()

export const fileRouter = {
  userAvatar: f({
    image: { maxFileSize: "512KB" },
  })
    .middleware(async () => {
      const { user } = await validateRequest()

      if (!user) throw new UploadThingError("No autorizado")

      return { user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatarUrl = metadata.user.avatarUrl

      if (oldAvatarUrl) {
        const key = oldAvatarUrl.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        )[1]

        await new UTApi().deleteFiles(key)
      }

      const newAvatarUrl = file.url.replace(
        "/f/",
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      )

      await prisma.user.update({
        where: { id: metadata.user.id },
        data: { avatarUrl: newAvatarUrl },
      })

      return { avatarUrl: newAvatarUrl }
    }),
  /* companyAvatar: f({
      image: { maxFileSize: "512KB" },
    })
      .middleware(async () => {
        const { user } = await validateRequest();
  
        if (!user) throw new UploadThingError("No autorizado");
  
        return { user };
      })
      .onUploadComplete(async ({ metadata, file }) => {
        const { user } = metadata;
        const companyId = metadata.companyId;
  
        // Verificar si el usuario tiene acceso a la compañía
        const company = await prisma.company.findFirst({
          where: {
            id: companyId,
            users: { some: { id: user.id } }, // Verificar que el usuario pertenece a la compañía
          },
        });
  
        if (!company) throw new UploadThingError("Acceso denegado a la compañía");
  
        const oldAvatarUrl = company.avatarUrl;
  
        if (oldAvatarUrl) {
          const key = oldAvatarUrl.split(
            `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
          )[1];
  
          await new UTApi().deleteFiles(key);
        }
  
        const newAvatarUrl = file.url.replace(
          "/f/",
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
        );
  
        await prisma.company.update({
          where: { id: companyId },
          data: { avatarUrl: newAvatarUrl },
        });
  
        return { avatarUrl: newAvatarUrl };
      }), */
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
