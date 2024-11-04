import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { RddAbilities } from './rdd-abilities'
import { RddAttributes } from './rdd-attributes'
import { DiceTray } from '../dice-tray'
import { RollHistory } from '../roll-history'

import { CharacterSheet } from '../../../domain/common/types'

type Props = {
  character: CharacterSheet
}

export const RddPage = ({ character }: Props) => {
  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <CharacterHeader character={character} />
        <Stack spacing={1} direction={'row'}>
          <Paper elevation={4}>
            <RddAttributes character={character} />
          </Paper>
          <Paper elevation={4}>
            <RddAbilities character={character} />
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