import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { AriaAttributes } from './aria-attributes'
import { AriaAbilities } from './aria-abilities'
import { DiceTray } from '../dice-tray'
import { RollHistory } from '../roll-history'

import { CharacterEditAttributes, CharacterEditAbilities } from '../character-edit-records'
import { CharacterSheet } from '../../../domain/common/types'

type Props = {
  character: CharacterSheet
}

export const AriaPage = ({ character }: Props) => {
  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <CharacterHeader character={character} />
        <Stack spacing={1} direction={'row'}>
          <Paper elevation={4}>
            <AriaAttributes attributes={character.attributes} />
          </Paper>
          <Paper elevation={4}>
            <CharacterEditAttributes character={character} />
          </Paper>
          <Paper elevation={4}>
            <AriaAbilities abilities={character.abilities} />
          </Paper>
          <Paper elevation={4}>
            <CharacterEditAbilities character={character} />
          </Paper>
          <Paper elevation={4}>
            <DiceTray />
          </Paper>
          <Paper elevation={4}>
            <RollHistory />
          </Paper>            
        </Stack>
      </Box>
    </Paper>
  )
}