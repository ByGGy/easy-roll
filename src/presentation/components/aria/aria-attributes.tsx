import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CasinoIcon from '@mui/icons-material/Casino'
import EditIcon from '@mui/icons-material/Edit'

import { CharacterEditAttributesDialog } from '../character-edit-records'
import { BasicPopover } from '../common/pop-over'
import { AriaRoll } from './aria-roll'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const AriaAttributes = ({ character }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleEdit = () => {
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
  }

  const sortedAttributes = character.state.attributes.toSorted((aA, aB) => aA.name.localeCompare(aB.name))
  
  return (
    <Stack padding={2}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>Attributes</Typography>
        </Grid>
        <Grid item xs='auto'>
          <IconButton color='secondary' onClick={handleEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
      <Stack padding={1}>
        {sortedAttributes.map((attribute) =>
          <Grid key={attribute.name} container alignItems='center' spacing={4}>
            <Grid item xs>
              <Typography variant='body1' color='text.secondary'>{attribute.name}</Typography>
            </Grid>
            <Grid item xs='auto'>
              <Typography variant='body1'>{attribute.value}</Typography>
            </Grid>
            <Grid item xs='auto'>
              <BasicPopover size='small' triggerContent={<CasinoIcon fontSize='small' color='primary' />} popoverContent={<AriaRoll characterId={character.id} rollStat='Attribute' statName={attribute.name} />} />
            </Grid>
          </Grid>
        )}
        <CharacterEditAttributesDialog open={openEditDialog} onClose={handleEditClose} character={character} />
      </Stack>
    </Stack>
  )
}