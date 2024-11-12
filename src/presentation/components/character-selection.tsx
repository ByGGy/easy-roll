import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { pickCharacter } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ColorizeIcon from '@mui/icons-material/Colorize'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import ListItemText from '@mui/material/ListItemText'

import { BasicPopover } from './common/pop-over'
import { DarkTooltip } from './common/style-helpers'

import { isNotUndefined } from '../../domain/common/tools'
import { EntityId } from '../../domain/common/types'
import { SessionData } from '../../domain/session/session'

type AddCharacterProps = {
  ignoreCharacterIds: Array<EntityId>
  handleSelection: (id: EntityId) => void
}

const AddCharacter = ({ ignoreCharacterIds, handleSelection }: AddCharacterProps) => {
  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const relevantCharacters = allCharacters.filter(c => ignoreCharacterIds.every(id => id !== c.id))
  const sortedCharacters = relevantCharacters.toSorted((cA, cB) => cA.state.name.localeCompare(cB.state.name))

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 300 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h6' color='primary'>Pick a character</Typography>
          </Grid>
        </Grid>
        <CardContent>
          <List dense>
            {sortedCharacters.map((c) =>
              <ListItem key={c.id}>
                <ListItemButton onClick={() => handleSelection(c.id)}>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={
                    <Typography variant='body1'>{c.state.name}</Typography>
                  } />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </CardContent>
      </Box>
    </Card>
  )
}

type Props = {
  session: SessionData
}

export const CharacterSelection = ({ session }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const relevantCharacters = session.state.characterIds.map(cId => allCharacters.find(c => c.id === cId)).filter(isNotUndefined)
  const sortedCharacters = relevantCharacters.toSorted((cA, cB) => cA.state.name.localeCompare(cB.state.name))

  const handleCreateCharacter = () => {
    window.electronAPI.createCharacterForSession(session.id)
  }

  const handleAddCharacter = (id: EntityId) => {
    window.electronAPI.addCharacterToSession(session.id, id)
  }

  const handleImportCharacter = () => {
    window.electronAPI.tryImportCharacterForSession(session.id)
  }

  const handleSelection = (id: EntityId) => {
    dispatch(pickCharacter(id))
  }

  return (
    <Stack padding={2}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary' mr={2}>Characters</Typography>
        </Grid>
        <Grid item xs='auto'>
          <Stack direction='row' spacing={1}>
            <DarkTooltip title='Create a new character'>
              <IconButton color='primary' onClick={handleCreateCharacter}>
                <NoteAddIcon />
              </IconButton>
            </DarkTooltip>
            <BasicPopover
              triggerContent={
                <DarkTooltip title='Pick an existing character'>
                  <ColorizeIcon color='primary' />
                </DarkTooltip>
              }
              popoverContent={<AddCharacter ignoreCharacterIds={relevantCharacters.map(c => c.id)} handleSelection={handleAddCharacter} />}
            />
            <DarkTooltip title='Import a character from a file'>
              <IconButton color='secondary' onClick={handleImportCharacter}>
                <ImportExportIcon />
              </IconButton>
            </DarkTooltip>
          </Stack>
        </Grid>
      </Grid>
      <List dense>
        {sortedCharacters.map((c) =>
          <ListItem key={c.id}>
            <ListItemButton onClick={() => handleSelection(c.id)}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={
                <Typography variant='body1'>{c.state.name}</Typography>
              } />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Stack>
  )
}