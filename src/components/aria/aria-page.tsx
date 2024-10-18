import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { AriaAttributes } from './aria-attributes'
import { AriaAbilities } from './aria-abilities'
import { DiceTray } from '../dice-tray'

import { CharacterSheet } from '../../domain/character/characterSheet'

type Props = {
  character: CharacterSheet
}

export const AriaPage = ({ character }: Props) => {
  return (
    <Paper elevation={1}>
      <Stack padding={2} gap={2}>
        <Paper elevation={2}>
          <CharacterHeader character={character} />
          <Stack padding={1} spacing={1} direction={'row'}>
            <Paper elevation={4}>
              <AriaAttributes attributes={character.attributes} />
            </Paper>
            <Paper elevation={4}>
              <AriaAbilities abilities={character.abilities} />
            </Paper>
            <Paper elevation={4}>
                <DiceTray />
              </Paper>
          </Stack>
        </Paper>
      </Stack>
    </Paper>
  )
}