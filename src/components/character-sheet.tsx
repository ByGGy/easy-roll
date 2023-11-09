import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Button from '@mui/material/Button'
import CasinoIcon from '@mui/icons-material/Casino'

import { InputSlider } from './input-slider'
import { DifficultyMultiplier } from './difficulty-multiplier'
import { BasicPopover } from './pop-over'
import { Character, Attribute, Ability } from '../domain/character/character'
import { CharacterAttributeRoll } from './character-roll'

type AttributeProps = {
  attribute: Attribute
}

export const AttributeBlock = ({ attribute }: AttributeProps) => {
  const [difficulty, setDifficulty] = useState(1)
  const [modifier, setModifier] = useState(0)

  const handleDifficultyChange = useCallback((value: number) => {
    setDifficulty(value)
  }, [setDifficulty])

  const handleModifierChange = useCallback((value: number) => {
    setModifier(value)
  }, [setModifier])

  const handleClick = useCallback(() => {
    window.electronAPI.checkAttribute(attribute.name, difficulty, modifier)
  }, [attribute, modifier])

  return (
    <Card>
      <Grid container alignItems='center' padding={1} spacing={6}>
        <Grid item xs>
          <Typography variant='h6'>
            {attribute.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='h6' color='secondary'>
            {attribute.value}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <BasicPopover triggerContent={<CasinoIcon />} popoverContent={<CharacterAttributeRoll attributeName={attribute.name} />} />
        </Grid>
      </Grid>
  </Card>
  )
}

type AbilityProps = {
  ability: Ability
}

export const AbilityBlock = ({ ability }: AbilityProps) => {
  const [modifier, setModifier] = useState(0)

  const handleModifierChange = useCallback((value: number) => {
    setModifier(value)
  }, [setModifier])

  const handleClick = useCallback(() => {
    window.electronAPI.checkAbility(ability.name, modifier)
  }, [ability, modifier])

  return (
    <Card>
      <Grid container alignItems='center' padding={1} spacing={6}>
        <Grid item xs>
          <Typography variant='subtitle1' color='primary'>
            {ability.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='body1' color='text.primary'>
            {`${ability.value}%`}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <InputSlider min={-30} max={+30} step={10} value={modifier} onChange={handleModifierChange} />
        </Grid>
        <Grid item xs='auto'>
          <Button variant="outlined" endIcon={<CasinoIcon />} onClick={handleClick}>
            Roll
          </Button>
        </Grid>
      </Grid>
  </Card>
  )
}

export const CharacterSheet = () => {
  const [character, setCharacter] = useState<Character | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electronAPI.getCurrentCharacter()
      const character = JSON.parse(data)
      setCharacter(character)
    }

    fetchData()
  }, [])

  if (character !== null) {
    return (
      <Paper elevation={4}>
        <Box padding={4}>
          <Grid container>
            <Grid item xs>
              <Paper elevation={1}>
                <Typography padding={2} variant='h3' color='secondary' gutterBottom>
                  <Box sx={{ fontWeight: 'bold' }}>{character.name}</Box>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <Stack spacing={4} direction={'row'}>
            <Paper elevation={8}>
              <Stack spacing={1} padding={2}>
                {character.attributes.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((attribute) => <AttributeBlock attribute={attribute} />)}
              </Stack>
            </Paper>
            <Paper elevation={8}>
              <Stack spacing={1} padding={2}>
                {character.abilities.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((ability) => <AbilityBlock ability={ability} />)}
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Paper>
    )
  }

  return (
    <p>Please select a character.</p>
  )
}