import { useRef } from "react"
import { Cropper, ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"

interface CropImageDialogProps {
  src: string
  cropAspectRatio: number
  onCropped: (blob: Blob | null) => void
  onClose: () => void
}

export default function CropImageDialog({
  src,
  cropAspectRatio,
  onClose,
  onCropped,
}: CropImageDialogProps) {
  const cropperRef = useRef<ReactCropperElement>(null)

  function crop() {
    const cropper = cropperRef.current?.cropper

    if (!cropper) return

    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp")
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="z-[150]">
        <DialogHeader>
          <DialogTitle>Recortar imagen</DialogTitle>
        </DialogHeader>
        <Cropper
          src={src}
          aspectRatio={cropAspectRatio}
          guides={false}
          zoomable={false}
          ref={cropperRef}
          className="mx-auto size-fit"
        />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={crop}>Recortar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
