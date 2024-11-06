import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import { evaluateModifierColor } from '../common/style-helpers'
import { CharacterEditAbilitiesDialog } from '../character-edit-records'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const RddAbilities = ({ character }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleEdit = () => {
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
  }

  const sortedAbilities = character.state.abilities.toSorted((aA, aB) => aA.name.localeCompare(aB.name))

  return (
    <Stack padding={2}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>Abilities</Typography>
        </Grid>
        <Grid item xs='auto'>
          <IconButton color='secondary' onClick={handleEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
      <Stack padding={1}>
        {sortedAbilities.map((ability) =>
          <Grid key={ability.name} container alignItems='center' mb={1} spacing={4}>
            <Grid item xs>
              <Typography variant='body1' color='text.secondary'>{ability.name}</Typography>
            </Grid>
            <Grid item xs='auto'>
              <Typography variant='body1' color={evaluateModifierColor(ability.value)}>
                {ability.value > 0 ? `+${ability.value}`: ability.value}
              </Typography>
            </Grid>
          </Grid>
        )}
        <CharacterEditAbilitiesDialog open={openEditDialog} onClose={handleEditClose} character={character} />
      </Stack>
    </Stack>
  )
}