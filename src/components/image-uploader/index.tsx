import styled from '@emotion/styled'
import { Box, Button as MuiButton, Divider, TextField, Typography } from '@mui/material'
import { spacing } from '@mui/system'
import React, { ChangeEventHandler, MouseEventHandler,useEffect, useState } from 'react'


const Button = styled(MuiButton)(spacing)

type Props = {
  onImageSelected?: (blob: Blob) => void
}

const ImageUploader: React.FC<Props> = ({ onImageSelected }) => {
  const [imageContent, setImageContent] = useState<Blob | undefined>()
  const [imageUrl, setImageUrl] = useState('')

  const handleFilePicked: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]

    if (file) {
      setImageContent(file)
    }
  }

  const handleUrlUploadChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setImageUrl(e.target.value)
  }

  const handleCopyFromBuffer: MouseEventHandler<HTMLButtonElement> = async () => {
    const findingMimeTypes = ['image/gif', 'image/jpeg', 'image/png']
    const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName })
    if (permission.state === 'denied') {
      return 
    }
    const items = await window.navigator.clipboard.read()

    for (const item of items) {
      const type = findingMimeTypes.find(type => item.types.indexOf(type) !== -1)
      if (type) {
        const image = await item.getType(type)
        setImageContent(image)
      }
    }
  }

  useEffect(() => {
    if (!imageUrl) { return }

    const fetchImage = async () => {
      try {
        console.log(imageUrl)

        const url = new URL(imageUrl)

        const res = await fetch(url.toString())
        const blob = await res.blob()

        setImageContent(blob)
      } catch(e) {
        console.log(e)
        // пока URL не валиден
      }
    }

    fetchImage()
  }, [imageUrl])


  useEffect(() => {
    if (imageContent) {
      onImageSelected?.(imageContent)
    }
  }, [imageContent])

  return <>
    <Box component={'form'} noValidate={true} autoComplete={'off'}>
      <div>
        <Button
          variant="contained"
          // @ts-ignore
          component="label"
          mt={2}
          mb={2}
        >
          Upload File
          <input
            type="file"
            accept='image/gif, image/jpeg, image/png'
            hidden
            onChange={handleFilePicked}
          />
        </Button>
      </div>
      <Divider><Typography>or</Typography></Divider>
      <div>
        <TextField label='Paste URL of image' value={imageUrl} onChange={handleUrlUploadChange} margin="normal"/>
      </div>
      <Divider><Typography>or</Typography></Divider>
      <div>
        <Button variant='contained' onClick={handleCopyFromBuffer} mt={2} mb={2}>copy from clipboard</Button>
      </div>
      <Divider></Divider>
    </Box>
  </>
}

export default ImageUploader