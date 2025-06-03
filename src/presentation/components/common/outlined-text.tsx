import Box from '@mui/material/Box'
import Typography, { TypographyOwnProps } from '@mui/material/Typography'
import { darken } from '@mui/material/styles'

type HexColor = `#${string}`

type Props = {
  text: string
  variant?: TypographyOwnProps['variant']
  color?: HexColor
}

export const OutlinedText = ({ text, variant, color }: Props) => {
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