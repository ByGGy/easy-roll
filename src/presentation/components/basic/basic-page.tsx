import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { BasicAttributes } from './basic-attributes'
import { BasicAbilities } from './basic-abilities'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const BasicPage = ({ character }: Props) => {
  return (
    <Stack spacing={1} padding={2} height='100%' overflow='hidden'>
      <CharacterHeader character={character} />
      <Stack spacing={1} direction={'row'} flex={1} overflow='hidden'>
        <Paper elevation={4}>
          <BasicAttributes character={character} />
        </Paper>
        <Paper elevation={4}>
          <BasicAbilities character={character} />
        </Paper>
      </Stack>
    </Stack>
  )
}