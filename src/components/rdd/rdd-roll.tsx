import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CardContent, CardActions, FormControl, InputLabel } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'

import { Ability } from '../../domain/character/characterSheet'

type Props = {
  attributeName: string
  abilities: Array<Ability>
}

export const RddRoll = ({ attributeName, abilities }: Props) => {
  const [abilityName, setAbilityName] = useState('')
  const [modifier, setModifier] = useState(0)

  const handleReset = () => {
    setAbilityName('')
    setModifier(0)
  }

  const handleAbilitySelection = (event: SelectChangeEvent) => {
    setAbilityName(event.target.value)
  }

  const handleModifierChange = (event: Event, newValue: number | number[]) => {
    setModifier(newValue as number)
  }

  const handleRoll = useCallback(() => {
    window.electronAPI.rddCheckAttribute(attributeName, abilityName, modifier)
  }, [attributeName, abilityName, modifier])

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 400 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h5'>{attributeName}</Typography>
          </Grid>
          <Grid item xs='auto'>
            <Button onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </Button>
          </Grid>
        </Grid>
        <CardContent>
          <Stack direction='column' spacing={2}>
              <Stack direction='row' spacing={4} alignItems='center'>
                <Typography variant='button' color='primary'>
                  Ability
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Pick one</InputLabel>
                  <Select
                    value={abilityName}
                    label='Pick one'
                    onChange={handleAbilitySelection}
                  >
                    <MenuItem value=''>None</MenuItem>
                    {abilities.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((ability) =>
                      <MenuItem key={ability.name} value={ability.name}>{`${ability.name} (${ability.value}) `}</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Stack>
            <Stack />
            <Stack />
            <Stack direction='row' spacing={4}>
                <Typography variant='button' color='primary'>
                  Offset
                </Typography>
                <Slider
                  value={modifier}
                  onChange={handleModifierChange}
                  min={-20}
                  max={+20}
                  step={1}
                  marks
                  valueLabelDisplay='on'
                />
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}