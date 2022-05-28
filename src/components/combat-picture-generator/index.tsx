import React, { useState } from 'react'
import BubbleDrawer from '../bubble-drawer'
import ImageCropper from '../image-cropper'
import ImageUploader from '../image-uploader'

const CombatPictureGenerator: React.FC = () => {
  const [image, setImage] = useState<string>()
  const [croppedImage, setCroppedImage] = useState<string>()
  return <>
    <ImageUploader onImageSelected={(blob) => setImage(URL.createObjectURL(blob))}/>
    { image && <ImageCropper src={image} onCropEnd={setCroppedImage}/>}
    { croppedImage && <BubbleDrawer imageSrc={croppedImage}/> }
  </>
}

export default CombatPictureGenerator