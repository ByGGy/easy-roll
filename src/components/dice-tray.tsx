import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { evaluateModifierColor } from './common/style-helpers'

const diceFaceQtyMarks = [
  {
    value: 6,
    label: 'd6',
  },
  {
    value: 20,
    label: 'd20',
  },
  {
    value: 100,
    label: 'd100',
  },
];

export const DiceTray = () => {
  const [diceFaceQty, setDiceFaceQty] = useState(20)
  const [diceQty, setDiceQty] = useState(1)
  const [modifier, setModifier] = useState(0)

  const handleReset = () => {
    setDiceFaceQty(20)
    setDiceQty(1)
    setModifier(0)
  }

  const handleDiceFaceChange = (event: Event, newValue: number | number[]) => {
    setDiceFaceQty(newValue as number)
  }

  const handleDiceQtyChange = (event: Event, newValue: number | number[]) => {
    setDiceQty(newValue as number)
  }

  const handleModifierChange = (event: Event, newValue: number | number[]) => {
    setModifier(newValue as number)
  }

  const handleRoll = useCallback(() => {
    window.electronAPI.diceTrayRoll(diceFaceQty, diceQty, modifier)
  }, [diceFaceQty, diceQty, modifier])

  return (
    <Box sx={{ minWidth: 400 }}>
      <Stack padding={2}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h5'>Dice Tray</Typography>
          </Grid>
          <Grid item xs='auto'>
            <Button onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </Button>
          </Grid>
        </Grid>
        <Stack padding='3rem 0 2rem 0' spacing={6}>
          <Stack direction='row' spacing={4}>
            <Typography variant='button' color='primary'>
              Dice
            </Typography>
            <Slider
              value={diceFaceQty}
              onChange={handleDiceFaceChange}
              min={2}
              max={100}
              step={1}
              marks={diceFaceQtyMarks}
              valueLabelDisplay='on'
              sx={{
                '& .MuiSlider-markLabel': {
                  color: 'primary.light',
                  fontSize: '0.65rem',
                },
              }}
            />
          </Stack>
          <Stack direction='row' spacing={4}>
            <Typography variant='button' color='primary'>
              Qty
            </Typography>
            <Slider
              value={diceQty}
              onChange={handleDiceQtyChange}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay='on'
            />
          </Stack>
          <Stack direction='row' spacing={4}>
            <Typography variant='button' color='primary'>
              Modifier
            </Typography>
            <Slider
              value={modifier}
              onChange={handleModifierChange}
              min={-10}
              max={+10}
              step={1}
              marks
              valueLabelDisplay='on'
              sx={{
                color: evaluateModifierColor(modifier)
              }}
            />
          </Stack>
        </Stack>
        <Button variant='contained' color='secondary' onClick={handleRoll} fullWidth>
          Roll
        </Button>
      </Stack>
    </Box>
  )
}