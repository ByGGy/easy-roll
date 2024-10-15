import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'

import { CharacterAttributes } from './character-attributes'
import { CharacterAbilities } from './character-abilities'

import { CharacterSheet } from '../domain/character/characterSheet'

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
            <Grid container alignItems='center'>
              <Grid item xs='auto'>
                <IconButton onClick={handleCloseSession} color='secondary'>
                  <LogoutIcon fontSize='large' />
                </IconButton>
              </Grid>
              <Grid item xs='auto'>
                <Box>
                  <Grid container alignItems='flex-end'>
                    <Grid item xs='auto'>
                      <Typography padding={2} variant='h5' color='primary'>
                        <Box sx={{ fontWeight: 'bold' }}>{character.name}</Box>
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography padding={2} variant='subtitle1' color='primary.dark'>
                        <Box>{character.game}</Box>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
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