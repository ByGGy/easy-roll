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
import { InputSlider } from './input-slider'
import { Character, Attribute, Ability } from '../domain/character/character'

type DifficultyMultiplierProps = {
  value: number
  onChange: (value: number) => void
}
export const DifficultyMultiplier = ({ value, onChange }: DifficultyMultiplierProps) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number | null,
  ) => {
    console.log(value)
    if (value !== null && onChange !== null) {
      onChange(Number(value))
    }
  }

  return (
    <Stack direction="row" spacing={4} alignItems='center'>
      <Typography variant='caption' color='secondary'>
        Multiplier
      </Typography>
      <ToggleButtonGroup
        value={value.toString()}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value='1'>
          <Typography variant='overline' color='text.primary'>x1</Typography>
        </ToggleButton>
        <ToggleButton value='2'>
          <Typography variant='overline' color='text.primary'>x2</Typography>
        </ToggleButton>
        <ToggleButton value='3'>
          <Typography variant='overline' color='text.primary'>x3</Typography>
        </ToggleButton>
        <ToggleButton value='4'>
          <Typography variant='overline' color='text.primary'>x4</Typography>
        </ToggleButton>
        <ToggleButton value='5'>
          <Typography variant='overline' color='text.primary'>x5</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}

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
          <Typography variant='subtitle1' color='text.primary'>
            {attribute.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='body1' color='text.primary'>
            {attribute.value}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <DifficultyMultiplier value={difficulty} onChange={handleDifficultyChange}/>
        </Grid>
        <Grid item xs='auto'>
          <InputSlider min={-30} max={+30} step={10} value={modifier} onChange={handleModifierChange} />
        </Grid>
        <Grid item xs='auto'>
          <Button variant='contained' size='small' onClick={handleClick}>Roll Dice</Button>
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
          <InputSlider min={-30} max={+30} step={10} value={modifier} onChange={handleModifierChange} />
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