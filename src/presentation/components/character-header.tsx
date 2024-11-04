import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'

import { BasicPopover } from './common/pop-over'
import { CharacterRename } from './character-rename'
import { DiscordConfiguration } from './discord-configuration'

import { CharacterSheet } from '../../domain/common/types'

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
        <Button variant='outlined' startIcon={<LogoutIcon />} onClick={handleCloseSession}>
          Back
        </Button>
      </Grid>
      <Grid item xs>
        <Box>
          <Grid container alignItems='flex-end'>
            <Grid item xs='auto'>
              <Stack direction='row' alignItems='center' padding={2}>
                <Typography variant='h5' mr={1}>{character.name}</Typography>
                <BasicPopover triggerContent={<EditIcon color='secondary' fontSize='small' />} popoverContent={<CharacterRename character={character} />} />
              </Stack>
            </Grid>
            <Grid item xs>
              <Typography padding={2} variant='subtitle1' color='text.secondary'>{character.game}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs='auto'>
        <DiscordConfiguration character={character} />
      </Grid>
    </Grid>
  )
}