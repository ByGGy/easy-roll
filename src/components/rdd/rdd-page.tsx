import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { RddAttributes } from './rdd-attributes'

import { CharacterSheet } from '../../domain/character/characterSheet'


type Props = {
  character: CharacterSheet
}

export const RddPage = ({ character }: Props) => {
  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <Paper elevation={2}>
          <CharacterHeader character={character} />
          <Box padding={1}>
            <Stack spacing={1} direction={'row'}>
              <Paper elevation={4}>
                <RddAttributes attributes={character.attributes} abilities={character.abilities} />
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Paper>
  )
}