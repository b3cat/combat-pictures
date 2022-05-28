import { ToggleButtonGroup, ToggleButton, Slider, Typography, Divider, Alert } from '@mui/material'
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react'

type Props = {
  imageSrc: string
}

type Point = [number, number]

const drawTriangleBySide = (
  canvas: HTMLCanvasElement,
  side: string,
  mouthPoint: Point = [canvas.width / 2, canvas.height / 2],
) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  ctx.fillStyle = '#cccccc'
  ctx.beginPath()

  switch(side) {
    case 'left':
      ctx.moveTo(0, (canvas.height * 3) / 8)
      ctx.lineTo(mouthPoint[0], mouthPoint[1])
      ctx.lineTo(0, (canvas.height * 5) / 8)
      break
    case 'top':
      ctx.moveTo((canvas.width * 3) / 8, 0)
      ctx.lineTo(mouthPoint[0], mouthPoint[1])
      ctx.lineTo((canvas.width * 5) / 8, 0)
      break
    case 'right':
      ctx.moveTo(canvas.width, (canvas.height * 3) / 8)
      ctx.lineTo(mouthPoint[0], mouthPoint[1])
      ctx.lineTo(canvas.width, (canvas.height * 5) / 8)
      break
    case 'bottom':
      ctx.moveTo((canvas.width * 3) / 8, canvas.height)
      ctx.lineTo(mouthPoint[0], mouthPoint[1])
      ctx.lineTo((canvas.width * 5) / 8, canvas.height)
      break
  }

  ctx.fill()
}

const drawBubbleBySide = (canvas: HTMLCanvasElement, side: string, bubbleSizeScale = 0.2) => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  ctx.fillStyle = '#cccccc'
  ctx.beginPath();

  switch(side) {
    case 'left':
      ctx.ellipse(
        0,
        canvas.height / 2,
        canvas.width * bubbleSizeScale,
        canvas.height / 1.5,
        Math.PI,
        0,
        2 * Math.PI,
      )
      break
    case 'top':
      ctx.ellipse(
        canvas.width / 2,
        0,
        canvas.width / 1.5,
        canvas.height * bubbleSizeScale,
        Math.PI,
        0,
        2 * Math.PI,
      )
      break
    case 'right':
      ctx.ellipse(
        canvas.width,
        canvas.height / 2,
        canvas.width * bubbleSizeScale,
        canvas.height / 1.5,
        Math.PI,
        0,
        2 * Math.PI,
      )
      break
    case 'bottom':
      ctx.ellipse(
        canvas.width / 2,
        canvas.height,
        canvas.width / 1.5,
        canvas.height * bubbleSizeScale,
        Math.PI,
        0,
        2 * Math.PI,
      )
      break
  }

  ctx.fill();
}

const drawImage = async (
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  side = 'right',
  mouthPoint?: Point,
  bubbleSizeScale?: number,
) => {
  if (!image.complete) {
    await new Promise<void>((res) => image.onload = () => res())
  }

  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  // const pixelRatio = window.devicePixelRatio

  canvas.width = image.width
  canvas.height = image.height

  // ctx.scale(pixelRatio, pixelRatio)
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
  )

  drawBubbleBySide(canvas, side, bubbleSizeScale)
  drawTriangleBySide(canvas, side, mouthPoint)
}

function createImage(src: string): HTMLImageElement {
  const image = document.createElement('img')
  image.src = src
  return image
}

const BubbleDrawer: React.FC<Props> = ({ imageSrc }) => {
  const [side, setSide] = useState<string>('right')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState(createImage(imageSrc))
  const [bubbleSizeScale, setBubbleSizeScale] = useState(0.25)
  const [mouthPoint, setMouthPoint] = useState<Point>()

  const handleSideChange = (
    event: React.MouseEvent<HTMLElement>,
    newSide: string | null,
  ) => {
    if (newSide) {
      setSide(newSide)
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      drawImage(image, canvasRef.current, side, mouthPoint, bubbleSizeScale)
    }
  }, [image, mouthPoint?.[0], mouthPoint?.[1], bubbleSizeScale, side])

  useEffect(() => {
    setImage(createImage(imageSrc))
  }, [imageSrc])

  const handleCanvasClick: MouseEventHandler<HTMLCanvasElement> = (e) => {
    const x = e.nativeEvent.x + window.pageXOffset - e.currentTarget.offsetLeft;
    var y = e.nativeEvent.y + window.pageYOffset - e.currentTarget.offsetTop;

    setMouthPoint([x, y])
  }

  return <div>
    <div>
      <Typography>Pick side where bubble will be placed</Typography>
      <ToggleButtonGroup
        value={side}
        exclusive
        onChange={handleSideChange}
        sx={{
          marginBlock: 2,
        }}
      >
        <ToggleButton value="left">
          left
        </ToggleButton>
        <ToggleButton value="top">
          top
        </ToggleButton>
        <ToggleButton value="right">
          right
        </ToggleButton>
        <ToggleButton value="bottom">
          bottom
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
    <Divider sx={{ marginBottom: 2 }}/>
    <div>
      <Typography id="input-slider">
        Change bubble size
      </Typography>
      <Slider value={bubbleSizeScale} onChange={(_, v) => { setBubbleSizeScale(v as number)}} step={0.05}  min={0} max={1}>
      </Slider>
    </div>
    <Divider sx={{ marginBottom: 2 }}/>
    <div>
      <Alert severity='info'>
        To change the position of the "mouth" vertex of the triangle just click in the right place on the picture
      </Alert>
      <Divider sx={{ marginBlock: 2 }}/>
    </div>
    <canvas onClick={handleCanvasClick} ref={canvasRef}/>

  </div>
}

export default BubbleDrawer