import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'

import { DiscordConfiguration } from './discord-configuration'

import { CharacterSheet } from '../domain/character/characterSheet'

type Props = {
  character: CharacterSheet
}

export const CharacterHeader = ({ character }: Props) => {
  const handleCloseSession = () => {
    window.electronAPI.closeSession()
  }

  return (
    <Grid container alignItems='center'>
      <Grid item xs='auto'>
        <IconButton onClick={handleCloseSession} color='secondary'>
          <LogoutIcon fontSize='large' />
        </IconButton>
      </Grid>
      <Grid item xs>
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
      <Grid item xs='auto' padding={2}>
        <DiscordConfiguration />
      </Grid>
    </Grid>
  )
}