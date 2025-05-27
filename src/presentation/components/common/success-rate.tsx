import { get } from 'lodash'
import Color from 'color'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography, { TypographyOwnProps } from '@mui/material/Typography'
import { useTheme } from '@mui/material'
import { darken } from '@mui/material/styles'

import { ShutterIcon } from './shutter-icon'

type HexColor = `#${string}`

type OutlinedTextProps = {
  text: string
  variant?: TypographyOwnProps['variant']
  color?: HexColor
}

const OutlinedText = ({ text, variant, color }: OutlinedTextProps) => {
  return (
    <Box position="relative" display="inline-block">
      <Box
        position="absolute"
        top={0}
        left={0}
        sx={{ zIndex: 0 }}
      >
        <Typography variant={variant}
          sx={{
            color: 'transparent',
            fontWeight: 'bold',
            WebkitTextStrokeWidth: '0.25em',
            WebkitTextStrokeColor: `${darken(color ?? '#000000', 0.65)}`,
          }}
        >
          {text}
        </Typography>
      </Box>

      <Typography variant={variant} color={color}
        sx={{
          position: 'relative',
          fontWeight: 'bold',
          zIndex: 1,
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

type Props = {
  ratio: number
}

export const SuccessRate = ({ ratio }: Props) => {
  const theme = useTheme()
  const warningColor = get(theme.palette, 'warning.main')
  const successColor = get(theme.palette, 'success.main')
  const targetColor = Color(warningColor).mix(Color(successColor), ratio).hex() as HexColor

  return (
    <Box position="relative" width={120} height={120}>
      <ShutterIcon opacity={0.15} color='disabled' sx={{
          position: 'absolute',
          top: '0%',
          left: '0%',
          width: '100%',
          height: '100%',
        }} />

      <Stack direction='row' alignItems='baseline' margin={4} sx={{
          position: 'absolute',
          top: '-5%',
          left: '10%',
        }}>
        <OutlinedText text={`${Math.round(ratio * 100)}`} variant='h3' color={targetColor} />
        <OutlinedText text='%' variant='h6' color={targetColor} />
      </Stack>
    </Box>
  )
}