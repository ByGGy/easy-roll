import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
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
      <Stack padding={2} gap={2}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h6' color='primary'>Dice Tray</Typography>
          </Grid>
          <Grid item xs='auto'>
            <IconButton color='secondary' onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Stack gap={1}>
          <Box>
            <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
              <Typography color='text.secondary'>Dice</Typography>
              <Typography variant='body2'>{`d${diceFaceQty}`}</Typography>
            </Stack>
            <Slider
              value={diceFaceQty}
              onChange={handleDiceFaceChange}
              min={2}
              max={100}
              step={1}
              marks={diceFaceQtyMarks}
              sx={{
                '& .MuiSlider-markLabel': {
                  color: 'primary.light',
                  fontSize: '0.65rem',
                },
              }}
            />
          </Box>
          <Box>
            <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
              <Typography color='text.secondary'>Quantity</Typography>
              <Typography variant='body2'>{`x${diceQty}`}</Typography>
            </Stack>
            <Slider
              value={diceQty}
              onChange={handleDiceQtyChange}
              min={1}
              max={10}
              step={1}
              marks
            />
          </Box>
          <Box>
            <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
              <Typography color='text.secondary'>Modifier</Typography>
              <Typography variant='body2'>{`${modifier > 0 ? '+' :''}${modifier}`}</Typography>
            </Stack>
            <Slider
              value={modifier}
              onChange={handleModifierChange}
              min={-20}
              max={+20}
              step={1}
              marks
              sx={{
                color: evaluateModifierColor(modifier)
              }}
            />
          </Box>
        </Stack>
        <Button variant='outlined' color='primary' onClick={handleRoll} fullWidth>
          Roll
        </Button>
      </Stack>
    </Box>
  )
}