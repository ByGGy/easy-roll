import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'

import { CharacterHeader } from '../character-header'
import { AriaAttributes } from './aria-attributes'
import { AriaAbilities } from './aria-abilities'

import { CharacterSheet } from '../../domain/character/characterSheet'


type Props = {
  character: CharacterSheet
}

export const AriaPage = ({ character }: Props) => {
  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <Paper elevation={2}>
          <CharacterHeader character={character} />
          <Box padding={1}>
            <Stack spacing={1} direction={'row'}>
              <Paper elevation={4}>
                <AriaAttributes attributes={character.attributes} />
              </Paper>
              <Paper elevation={4}>
                <AriaAbilities abilities={character.abilities} />
              </Paper>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Paper>
  )
}