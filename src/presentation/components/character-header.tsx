import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'

import { HeroIcon } from './common/hero-icon'
import { EditText } from './common/edit-text'
import { DiscordConfiguration } from './discord-configuration'

import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

export const CharacterHeader = ({ character }: Props) => {

  const handleRename = (newName: string) => {
    window.electronAPI.renameCharacter(character.id, newName)
  }

  return (
    <Grid container alignItems='center' mb={1}>
      <Grid item xs='auto'>        
        <Avatar sx={{ bgcolor: 'text.primary' }}>
          <HeroIcon />
        </Avatar>
      </Grid>
      <Grid item xs>
        <Stack direction='row' ml={1} alignItems='center'>
          <Typography variant='h6' mr={1}>{character.state.name}</Typography>
          <EditText fieldLabel='New Name' fieldValue={character.state.name} actionLabel='Rename' onApply={handleRename} />
        </Stack>
      </Grid>
      <Grid item xs='auto'>
        <DiscordConfiguration character={character} />
      </Grid>
    </Grid>
  )
}