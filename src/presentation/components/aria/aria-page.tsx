import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { AriaAttributes } from './aria-attributes'
import { AriaAbilities } from './aria-abilities'
import { DiceTray } from '../dice-tray'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const AriaPage = ({ character }: Props) => {
  return (
    <Box padding={2}>
      <CharacterHeader character={character} />
      <Stack spacing={1} direction={'row'}>
        <Paper elevation={4}>
          <AriaAttributes character={character} />
        </Paper>
        <Paper elevation={4}>
          <AriaAbilities character={character} />
        </Paper>
        <Paper elevation={4}>
          <DiceTray character={character} />
        </Paper>        
      </Stack>
    </Box>
  )
}