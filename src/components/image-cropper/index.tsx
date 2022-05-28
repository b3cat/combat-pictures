import { Button as MuiButton, Divider, styled } from '@mui/material'
import { spacing } from '@mui/system'
import React, { RefObject, useEffect, useRef, useState } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

type Props = {
  src: string,
  onCropEnd?: (resultImage: string) => void 
}

const Button = styled(MuiButton)(spacing)

const generateCroppedImage = (image: HTMLImageElement, crop: PixelCrop) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  console.log(image.complete)
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height
  const pixelRatio = window.devicePixelRatio

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

  ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  const centerX = image.naturalWidth / 2
  const centerY = image.naturalHeight / 2

  ctx.translate(-cropX, -cropY)
  ctx.translate(centerX, centerY)
  ctx.translate(-centerX, -centerY)
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  )

  return canvas.toDataURL()
}

const ImageCropper: React.FC<Props> = ({ src, onCropEnd }) => {
  const [cropped, setCropped] = useState(false)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imageRef = useRef<HTMLImageElement>(null)

  const image = imageRef.current
  const isCropped = !!(completedCrop?.width && completedCrop.height)

  const handleCroppingEnd = () => {
    const croppedImage = isCropped
      ? generateCroppedImage(image!, completedCrop)
      : src
  
    onCropEnd?.(croppedImage)
    setCropped(true)
  }

  const handleRestartCropping = () => {
    onCropEnd?.('')
    setCropped(false)
  }

  if (cropped) {
    return <>
      <Button variant='contained' mb={2} mt={2} onClick={handleRestartCropping}>Crop Again</Button>
      <Divider sx={{ marginBottom: 2 }}/>
    </>
  }

  return <>
    {<div>
      <Button variant='contained' mb={2} mt={2} onClick={handleCroppingEnd}>
        {isCropped ? 'Continue with cropped image' : 'Continue without cropping'}
      </Button>
      <Divider sx={{ marginBottom: 2 }}/>
    </div>}
    <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
      <img ref={imageRef} src={src} />
    </ReactCrop>
  </>
}

export default ImageCropper


