import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Jdenticon from 'react-jdenticon'

import { EditValue } from './common/edit-value'
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
          <Jdenticon value={character.state.name} />
        </Avatar>
      </Grid>
      <Grid item xs ml={1}>
        <EditValue variant='h6' initialValue={character.state.name} onApply={handleRename} />
      </Grid>
      <Grid item xs='auto'>
        <DiscordConfiguration character={character} />
      </Grid>
    </Grid>
  )
}