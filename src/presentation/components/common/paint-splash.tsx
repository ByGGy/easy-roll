import { CSSProperties, ReactNode, useEffect, useState } from 'react'

import { SxProps, Theme } from '@mui/material'
import Box from '@mui/material/Box'

import seedrandom from 'seedrandom'

const stroke1Texture = './images/paint_textures/stroke1.png'
const stroke2Texture = './images/paint_textures/stroke2.png'
const splatTexture = './images/paint_textures/splat1.png'
const detailTexture = './images/paint_textures/details.png'

type PaintCanvasProps = {
  sx?: SxProps<Theme>
  children: ReactNode
}

const PaintCanvas = ({ sx, children }: PaintCanvasProps) => {
  return (
    <Box sx={sx} position='relative' display='flex' justifyContent='center'>
      {children}
    </Box>
  )
}

type PaintItemProps = {
  textureUrl: string
  fillColor: CSSProperties['color']
  translate: [number, number]
  scale: [number, number]
  rotation: number
  opacity: number
}

const PaintItem = ({ textureUrl, fillColor, translate, scale, rotation, opacity }: PaintItemProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',

        mixBlendMode: 'screen',

        // PNG used as alpha mask
        maskImage: `url(${textureUrl})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',

        backgroundColor: fillColor,
        transform: `translate(${translate[0]}%, ${translate[1]}%) scale(${scale[0]}, ${scale[1]}) rotate(${rotation}deg)`,
        opacity
      }}
    />
  )
}

type PaintSplashProps = {
  sx?: SxProps<Theme>
  seed: string
  intensity: number
  palette: Array<CSSProperties['color']>
  children: ReactNode
}

export const PaintSplash = ({ sx, seed, intensity, palette, children }: PaintSplashProps) => {
  const [itemsProps, setItemsProps] = useState<Array<PaintItemProps>>([])

  const generateBaseProps = (rng: seedrandom.PRNG): PaintItemProps => ({
    textureUrl: rng() > 0.5 ? stroke1Texture : stroke2Texture,
    fillColor: palette[0],
    translate: [0, 0],
    scale: [rng() > 0.5 ? 1 : -1, rng() > 0.5 ? 1 : -1],
    rotation: (rng() -0.5) *5,
    opacity: 1//0.9
  })

  const generateSplatProps = (rng: seedrandom.PRNG): PaintItemProps => ({
    textureUrl: splatTexture,
    fillColor: palette[1 % palette.length],
    translate: [(rng() - 0.5) *10, (rng() - 0.5) *10],
    scale: [(rng() > 0.5 ? 1 : -1) *1.5, (rng() > 0.5 ? 1 : -1) *1.5],
    rotation: rng() *360,
    opacity: 0.9 -rng() *0.25 //0.75
  })

  const generateDetailsProps = (rng: seedrandom.PRNG): PaintItemProps => ({
    textureUrl: detailTexture,
    fillColor: palette[2 % palette.length],
    translate: [(rng() - 0.5) *10, (rng() - 0.5) *10],
    scale: [(rng() > 0.5 ? 1 : -1) *1.5, (rng() > 0.5 ? 1 : -1) *1.5],
    rotation: rng() *360,
    opacity: 0.8 -rng() *0.5 //0.5
  })

  useEffect(() => {
    const rng = seedrandom(seed)
    const base = generateBaseProps(rng)
    const splats = [...Array(Math.floor(4 * intensity))].map(_ => generateSplatProps(rng))
    const details = [...Array(Math.floor(4 * intensity))].map(_ => generateDetailsProps(rng))
    setItemsProps([base, ...splats, ...details])
  }, [intensity, palette])

  return (
    <PaintCanvas sx={sx}>
      {itemsProps.map((itemProps, index) => <PaintItem key={index} {...itemProps} />)}
      <Box zIndex={10} display='flex' alignItems='center'>
        {children}
      </Box>
    </PaintCanvas>
  )
}