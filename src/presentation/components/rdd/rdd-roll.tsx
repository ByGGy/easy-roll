import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { CardContent, CardActions, FormControl, InputLabel } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { evaluateModifierColor } from '../common/style-helpers'

import { Ability } from '../../domain/character/characterSheet'

type AbilityItemProps = {
  ability: Ability
}

const AbilityItem = ({ ability }: AbilityItemProps) => {
  return (
    <Box display='flex' alignItems='center' gap={1}>
      <Typography variant='body1'>{ability.name}</Typography>
      <Typography variant='overline' color={evaluateModifierColor(ability.value)}>
        {ability.value > 0 ? `+${ability.value}`: ability.value}
      </Typography>
    </Box>
  )
}

type Props = {
  attributeName: string
  abilities: Readonly<Array<Ability>>
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

  const sortedAbilities = abilities.toSorted((aA, aB) => aA.name.localeCompare(aB.name))

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 400 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h6' color='primary'>{attributeName}</Typography>
          </Grid>
          <Grid item xs='auto'>
            <IconButton color='secondary' onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </IconButton>
          </Grid>
        </Grid>
        <CardContent>
          <Stack gap={4}>
            <FormControl fullWidth>
              <InputLabel>Pick an ability</InputLabel>
              <Select
                value={abilityName}
                label='Pick an ability'
                onChange={handleAbilitySelection}
              >
                <MenuItem value=''>None</MenuItem>
                {sortedAbilities.map((ability) =>
                  <MenuItem key={ability.name} value={ability.name}>
                    <AbilityItem ability={ability} />
                  </MenuItem>
                )}
              </Select>
            </FormControl>
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
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}