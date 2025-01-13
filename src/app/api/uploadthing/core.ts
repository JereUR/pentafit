import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

import { validateRequest } from "@/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await validateRequest()

      if (!user) throw new UploadThingError("Unauthorized")

      return { user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.user.user?.id)
      console.log("file url", file.url)
      return { uploadedBy: metadata.user.user?.id }
    }),

  facilityImageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await validateRequest()

      if (!user) throw new UploadThingError("Unauthorized")

      return { user }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(
        "Facility image upload complete for userId:",
        metadata.user.user?.id,
      )
      console.log("file url", file.url)
      return { uploadedBy: metadata.user.user?.id }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
