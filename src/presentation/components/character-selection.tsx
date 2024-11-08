import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { pickCharacter } from '../store/selectionSlice'

import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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

import { isNotUndefined } from '../../domain/common/tools'
import { EntityId } from '../../domain/common/types'
import { SessionData } from '../../domain/session/session'

type Props = {
  session: SessionData
}

export const CharacterSelection = ({ session }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const relevantCharacters = session.state.characterIds.map(cId => allCharacters.find(c => c.id === cId)).filter(isNotUndefined)
  const sortedCharacters = relevantCharacters.toSorted((cA, cB) => cA.state.name.localeCompare(cB.state.name))

  const handlePickCharacter = () => {
    // window.electronAPI.createDefaultCharacter('Aria')
  }

  const handleCreateCharacter = () => {
    window.electronAPI.createCharacterForSession(session.id)
  }

  const handleImportCharacter = () => {
    // window.electronAPI.tryImportCharacter()
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
          <Stack direction='row' spacing={2}>
            <Button variant={sortedCharacters.length === 0 ? 'contained' : 'outlined'} startIcon={<ColorizeIcon />} onClick={handlePickCharacter}>
              Pick a character
            </Button>
            <Button variant={sortedCharacters.length === 0 ? 'contained' : 'outlined'} startIcon={<NoteAddIcon />} onClick={handleCreateCharacter}>
              Create a character
            </Button>
            <Button variant={sortedCharacters.length === 0 ? 'contained' : 'outlined'} color='secondary' startIcon={<ImportExportIcon />} onClick={handleImportCharacter}>
              Import a character
            </Button>
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