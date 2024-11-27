import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { RddAbilities } from './rdd-abilities'
import { RddAttributes } from './rdd-attributes'
import { DiceTray } from '../dice-tray'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const RddPage = ({ character }: Props) => {
  return (
    <Stack spacing={1} padding={2} height='100%' overflow='hidden'>
      <CharacterHeader character={character} />
      <Stack spacing={1} direction={'row'} flex={1} overflow='hidden'>
        <Paper elevation={4}>
          <RddAttributes character={character} />
        </Paper>
        <Paper elevation={4}>
          <RddAbilities character={character} />
        </Paper>
      </Stack>
      <Paper elevation={4}>
        <DiceTray character={character} />
      </Paper>
    </Stack>
  )
}