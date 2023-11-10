import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import { AttributeBlock } from './attribute-block'
import { AbilityBlock } from './ability-block'

import { Character } from '../domain/character/character'

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
        <Box padding={2}>
          <Paper elevation={1}>
            <Typography padding={2} variant='h4' color='secondary'>
              <Box sx={{ fontWeight: 'bold' }}>{character.name}</Box>
            </Typography>
          </Paper>
          <Paper elevation={2}>
          <Box padding={1}>
            <Stack spacing={1} direction={'row'}>
              <Paper elevation={6}>
                <Stack spacing={1} padding={1}>
                  {character.attributes.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((attribute) => <AttributeBlock attribute={attribute} />)}
                </Stack>
              </Paper>
              <Paper elevation={6}>
                <Stack spacing={1} padding={1}>
                  {character.abilities.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((ability) => <AbilityBlock ability={ability} />)}
                </Stack>
              </Paper>
            </Stack>
            </Box>
          </Paper>
        </Box>
      </Paper>
    )
  }

  return (
    <p>Please select a character.</p>
  )
}