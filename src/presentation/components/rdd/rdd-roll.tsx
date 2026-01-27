import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'

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
import { DiceIcon } from '../common/dice-icon'
import { SuccessRate } from '../common/success-rate'

import { Ability, EntityId } from '../../../domain/common/types'

const DEFAULT_ABILITY_NAME = ''
const DEFAULT_MODIDIFER = 0

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
  characterId: EntityId
  attributeName: string
  initAbilityName?: string
  initModifier?: number
}

export const RddRoll = ({ characterId, attributeName, initAbilityName= DEFAULT_ABILITY_NAME, initModifier= DEFAULT_MODIDIFER }: Props) => {
  const [abilityName, setAbilityName] = useState(initAbilityName)
  const [modifier, setModifier] = useState(initModifier)
  const [successRatio, setSuccessRatio] = useState(0)

  useEffect(() => {
    window.electronAPI.evaluateCharacterSuccessRatio({
      game: 'Rêve de Dragon',
      characterId,
      kind: 'rddCheckAttribute',
      attributeName,
      abilityName,
      modifier
    })
  }, [abilityName, modifier])

  useEffect(() => {
    window.electronAPI.onMessage('Domain.Rdd.successRatio', setSuccessRatio)
  }, [])

  const handleReset = () => {
    setAbilityName(DEFAULT_ABILITY_NAME)
    setModifier(DEFAULT_MODIDIFER)
  }

  const handleAbilitySelection = (event: SelectChangeEvent) => {
    setAbilityName(event.target.value)
  }

  const handleModifierChange = (event: Event, newValue: number | number[]) => {
    setModifier(newValue as number)
  }

  const handleRoll = () => {
    window.electronAPI.checkCharacter({
      game: 'Rêve de Dragon',
      characterId,
      kind: 'rddCheckAttribute',
      attributeName,
      abilityName,
      modifier
    })
  }

  const characters = useSelector((state: RootState) => state.characterCollection.characters)
  const targetCharacter = characters.find(c => c.id === characterId)
  const sortedAbilities = targetCharacter?.state.abilities.toSorted((aA, aB) => aA.name.localeCompare(aB.name)) ?? []

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 500 }}>
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
          <Grid container alignItems='center'>
            <Grid item xs>
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
            </Grid>
            <Grid item xs='auto' ml={2}>
              <SuccessRate ratio={successRatio} />
            </Grid>
          </Grid>              
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' startIcon={<DiceIcon />} onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}