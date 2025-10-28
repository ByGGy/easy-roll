import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import { CharacterEditAbilitiesDialog } from '../character-edit-records'
import { CustomPopover } from '../common/pop-over'
import { AriaRoll } from './aria-roll'
import { DiceIcon } from '../common/dice-icon'

import { CharacterData } from '../../../domain/character/character'

type Props = {
  character: CharacterData
}

export const AriaAbilities = ({ character }: Props) => {
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const handleEdit = () => {
    setOpenEditDialog(true)
  }

  const handleEditClose = () => {
    setOpenEditDialog(false)
  }

  const sortedAbilities = character.state.abilities.toSorted((aA, aB) => aA.name.localeCompare(aB.name))

  return (
    <Stack padding={2} height='100%' overflow='hidden'>
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
      <List dense sx={{ flex: 1, overflow: 'auto' }}>
        {sortedAbilities.map((ability) =>
          <ListItem
            key={ability.name}
            disablePadding
            sx={{
              '& .dice-action': {
                opacity: 0.25,
                color: (theme) => theme.palette.text.secondary,
                transition: 'all 0.2s',
              },
              '&:hover .dice-action': {
                opacity: 1,
                color: (theme) => theme.palette.primary.main,
              },
            }}>
            <CustomPopover
              direction='down'
              triggerComponent={
                <ListItemButton>
                  <Grid key={ability.name} container alignItems='center' columnSpacing={2}>
                    <Grid item xs='auto'>
                      <DiceIcon className='dice-action' fontSize='small' color='primary' sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant='body1'>{ability.name}</Typography>
                    </Grid>
                    <Grid item xs='auto'>
                      <Typography variant='body1' color='text.secondary'>{ability.value}</Typography>
                    </Grid>
                  </Grid>
                </ListItemButton>
              }
              popoverContent={
                <AriaRoll
                  characterId={character.id}
                  rollStat='Ability'
                  statName={ability.name}
                />
              }
            />
          </ListItem>
        )}
      </List>
      <CharacterEditAbilitiesDialog open={openEditDialog} onClose={handleEditClose} character={character} />
    </Stack>
  )
}