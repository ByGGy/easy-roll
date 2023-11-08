import * as React from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'

const Input = styled(MuiInput)`
  width: 64px
`

type Props = {
  value: number
  min: number
  max: number
  onChange?: (value: number) => void
}

export const InputSlider = ({ value, min, max, onChange }: Props) => {
  const update = (value: number) => {
    if (onChange) {
      onChange(value)
    }
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    update(newValue as number)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    update(event.target.value === '' ? 0 : Number(event.target.value))
  }

  const handleBlur = () => {
    if (value < min) {
      update(min)
    } else if (value > max) {
      update(max)
    }
  }

  return (
    <Box sx={{ width: 300 }}>
      <Grid container spacing={2} alignItems='center'>
        <Grid item>
          <Typography id='input-slider' variant='caption' color='secondary'>
            Mod.
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby='input-slider'
            step={5}
            min={min}
            max={max}
            size='small'
            marks
            color='secondary'
          />
        </Grid>
        <Grid item>
          <Input
            value={value}
            size='small'
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 5,
              min,
              max,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}