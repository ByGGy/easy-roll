import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { DiceIcon } from './common/dice-icon'

import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

export const NewDiceTray = ({ character }: Props) => {
  const [expression, setExpression] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(event.target.value)
  }

  const handleRoll = () => {
    window.electronAPI.diceTrayEvaluate(character.id, expression)
  }

  return (
    <Stack padding={2} gap={2}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>Dice Tray</Typography>
        </Grid>
      </Grid>
      <Stack direction='row' gap={2}>
        <TextField
            type='text'
            label='expression'
            defaultValue='1d20'
            value={expression}
            fullWidth
            onChange={handleChange}
          />
        <Button variant='outlined' color='primary' startIcon={<DiceIcon />} onClick={handleRoll}>
          Roll
        </Button>
      </Stack>
    </Stack>
  )
}