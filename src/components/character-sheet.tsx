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
import Button from '@mui/material/Button'
import { InputSlider } from './input-slider'
import { Character, Attribute, Ability } from '../domain/character/character'

type AttributeProps = {
  attribute: Attribute
}

export const AttributeBlock = ({ attribute }: AttributeProps) => {
  return (
    <Card>
      <Grid container alignItems='center' padding={1} spacing={6}>
        <Grid item xs>
          <Typography variant='subtitle1' color='text.primary'>
            {attribute.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='body1' color='text.primary'>
            {attribute.value}
          </Typography>
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
          <Typography variant='subtitle1' color='text.primary'>
            {ability.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='body1' color='text.primary'>
            {`${ability.value}%`}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <InputSlider min={-50} max={+50} value={modifier} onChange={handleModifierChange} />
        </Grid>
        <Grid item xs='auto'>
          <Button variant='contained' size='small' onClick={handleClick}>Roll Dice</Button>
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
      <Box padding={4}>
        <Grid container>
          <Grid item xs>
            <Typography variant='h3' color='secondary' gutterBottom>
              <Box sx={{ fontWeight: 'bold' }}>{character.name}</Box>
            </Typography>
          </Grid>
        </Grid>
        <Stack spacing={4} direction={'row'}>
          <Paper elevation={1}>
            <Stack spacing={1}>
              {character.attributes.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((attribute) => <AttributeBlock attribute={attribute} />)}
            </Stack>
          </Paper>
          <Paper elevation={1}>
            <Stack spacing={1}>
              {character.abilities.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((ability) => <AbilityBlock ability={ability} />)}
            </Stack>
          </Paper>
        </Stack>
      </Box>
    )
  }

  return (
    <p>Please select a character.</p>
  )
}