import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

import { Box } from '@mui/material'

export const TorchOverlay = () => {
  const isEnabled = useSelector((state: RootState) => state.uiOptions.isTorchOverlayEnabled)

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [style, setStyle] = useState('')

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    window.addEventListener('mousemove', onMove)

    let raf: number

    const animate = () => {
      const t = performance.now()

      // Flicker parameters
      const radius = 150 + Math.sin(t / 90) * 6 + Math.sin(t / 37) * 4
      const radius2 = 170 + Math.sin(t / 30) * 6 + Math.sin(t / 30) * 2
      const radius3 = 200 + Math.sin(t / 75) * 5 + Math.sin(t / 120) * 3

      const offset = { x: 10 * Math.sin(t / 90) * 0.6, y: 10 * Math.sin(t / 37) * 0.4 }
      const offset2= { x: 8 * Math.sin(t / 30) * 0.6, y: 8 * Math.sin(t / 30) * 0.2 }
      const offset3= { x: 4 * Math.sin(t / 75) * 0.5, y: 4 * Math.sin(t / 120) * 0.3 }

      const glow = 0.1 + Math.sin(t / 120) * 0.03

      setStyle(`
        radial-gradient(
          circle ${radius}px at ${mouse.current.x + offset.x}px ${mouse.current.y + offset.y}px,
          rgba(255,220,160,${glow * 0.25}) 0%,
        rgba(0,0,0,0.0) 50%
        ),
        radial-gradient(
          circle ${radius2}px at ${mouse.current.x + offset2.x}px ${mouse.current.y + offset2.y}px,
          rgba(255,200,120,${glow * 0.15}) 0%,
        rgba(0,0,0,0.0) 75%
        ),
        radial-gradient(
          circle ${radius3}px at ${mouse.current.x + offset3.x}px ${mouse.current.y + offset3.y}px,
          rgba(255,255,255,${glow * 0.05}) 0%,
        rgba(0,0,0,0.20) 85%
        )
      `)

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!isEnabled) {
    return null
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2000,
      }}
    >
      {/* Torch gradient */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: style,
        }}
      />

      {/* Noise layer */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(./images/noise.png)',
          maskImage: style,
          maskMode: 'luminance'
        }}
      />
    </Box>
  )
}
