import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'

import { BasicPopover } from './common/pop-over'
import { CharacterRename } from './character-rename'
import { DiscordConfiguration } from './discord-configuration'

import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

export const CharacterHeader = ({ character }: Props) => {
  return (
    <Grid container alignItems='center'>
      <Grid item xs='auto'>        
        <Avatar>
          <PersonIcon />
        </Avatar>
      </Grid>
      <Grid item xs>
        <Stack direction='row' alignItems='center' padding={2}>
          <Typography variant='h5' mr={1}>{character.state.name}</Typography>
          <BasicPopover triggerContent={<EditIcon color='secondary' fontSize='small' />} popoverContent={<CharacterRename character={character} />} />
        </Stack>
      </Grid>
      <Grid item xs='auto'>
        <DiscordConfiguration character={character} />
      </Grid>
    </Grid>
  )
}