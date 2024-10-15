import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'

import { CharacterAttributes } from './character-attributes'
import { CharacterAbilities } from './character-abilities'

import { CharacterSheet } from '../domain/character/characterSheet'

// import { Character } from '../domain/character/character'

export const CharacterPage = () => {
  const [character, setCharacter] = useState<CharacterSheet | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electronAPI.getCurrentCharacter()
      const character = JSON.parse(data)
      setCharacter(character)
    }

    fetchData()
  }, [])

  const handleCloseSession = () => {
    window.electronAPI.closeSession()
  }

  if (character !== null) {
    return (
      <Paper elevation={1}>
        <Box padding={2}>
          <Paper elevation={2}>
            <Typography padding={2} variant='h4' color='primary'>
              <Box sx={{ fontWeight: 'bold' }}>{character.name}</Box>
            </Typography>
            <IconButton onClick={handleCloseSession} color='secondary'>
              <LogoutIcon />
            </IconButton>
            <Box padding={1}>
              <Stack spacing={1} direction={'row'}>
                <Paper elevation={4}>
                  <CharacterAttributes attributes={character.attributes} />
                </Paper>
                <Paper elevation={4}>
                  <CharacterAbilities abilities={character.abilities} />
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