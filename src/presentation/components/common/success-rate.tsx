import { get } from 'lodash'
import Color from 'color'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useTheme, keyframes } from '@mui/material'

import { OutlinedText } from './outlined-text'
import { ShutterIcon } from './shutter-icon'

type Props = {
  ratio: number
}

const shutterCloseKeyframes = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0.15;
    filter: blur(0px);
  }
  40% {
    transform: rotate(-60deg) scale(0.65);
    opacity: 0.5;
    filter: blur(4px);
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 0.15;
    filter: blur(0px);
  }
`

export const SuccessRate = ({ ratio }: Props) => {
  const [animateKey, setAnimateKey] = useState(0)

  const theme = useTheme()
  const warningColor = get(theme.palette, 'warning.main')
  const successColor = get(theme.palette, 'success.main')
  const targetColor = Color(warningColor).mix(Color(successColor), ratio).hex() as HexColor

  useEffect(() => {
    setAnimateKey(prev => prev + 1)
  }, [ratio])

  return (
    <Box position="relative" width={120} height={120}>
      <ShutterIcon key={animateKey} opacity={0.15} color='disabled' sx={{
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '100%',
          height: '100%',
          animation: `${shutterCloseKeyframes} 0.3s ease-in-out`,
        }} />

      <Stack direction='row' alignItems='baseline' margin={4} sx={{
          position: 'absolute',
          top: '5%',
          left: '10%',
        }}>
        <OutlinedText text={`${Math.round(ratio * 100)}`} variant='h3' color={targetColor} />
        <OutlinedText text='%' variant='h6' color={targetColor} />
      </Stack>
    </Box>
  )
}