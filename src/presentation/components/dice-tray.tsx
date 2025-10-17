import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import { CharacterEditDiceActionsDialog } from './character-edit-records'
import { DiceIcon } from './common/dice-icon'

import { DiceAction } from '../../domain/common/types'
import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

// TODO: should be able to provide a label / title when evaluating the expression, used for displaying the result
export const DiceTray = ({ character }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleEdit = () => {
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
  }

  const handleRoll = (action: DiceAction) => {
    window.electronAPI.diceActionExecute(character.id, action.name)
  }

  const sortedActions = character.state.diceActions.toSorted((aA, aB) => aA.name.localeCompare(aB.name))
  
  return (
    <Stack padding={2} height='100%' overflow='hidden'>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>New Dice Tray</Typography>
        </Grid>
        <Grid item xs='auto'>
          <IconButton color='secondary' onClick={handleEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Grid>
      </Grid>
      <Stack padding={1} sx={{ flex: 1, overflow: 'auto' }}>
        {sortedActions.map((action) =>
          <Grid key={action.name} container alignItems='center' spacing={4}>
            <Grid item xs>
              <Typography variant='body1' color='text.secondary'>{action.name}</Typography>
            </Grid>
            <Grid item xs='auto'>
              <Typography variant='body1'>{action.expression}</Typography>
            </Grid>
            <Grid item xs='auto'>
              <IconButton size='small' onClick={() => handleRoll(action)} >
                <DiceIcon fontSize='small' color='primary' />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <CharacterEditDiceActionsDialog open={openEditDialog} onClose={handleEditClose} character={character} />
      </Stack>
    </Stack>
  )
}