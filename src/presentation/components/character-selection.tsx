import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import ListItemText from '@mui/material/ListItemText'

import { EntityId } from '../../domain/common/types'

export const CharacterSelection = () => {
  const characters = useSelector((state: RootState) => state.characterCollection.characters)
  const sortedCharacters = characters.toSorted((cA, cB) => cA.state.name.localeCompare(cB.state.name))

  const handleCreateAriaCharacter = () => {
    window.electronAPI.createDefaultCharacterSheet('Aria')
  }

  const handleCreateRddCharacter = () => {
    window.electronAPI.createDefaultCharacterSheet('Rêve de Dragon')
  }

  const handleImportCharacter = () => {
    window.electronAPI.tryImportCharacter()
  }

  const handleSelection = (id: EntityId) => {
    window.electronAPI.openSession(id)
  }

  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <Grid container alignItems='center' >
          <Grid item xs='auto'>
            <Typography padding={2} variant='h5' color='primary'>{characters.length === 0 ? 'No available characters' : 'Pick a character'}</Typography>
          </Grid>
          <Grid item xs>
            <Stack direction='row' spacing={2}>
              <Button variant={characters.length === 0 ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateAriaCharacter}>
                Create an "Aria" character
              </Button>
              <Button variant={characters.length === 0 ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateRddCharacter}>
                Create a "Rêve de Dragon" character
              </Button>
              <Button variant={characters.length === 0 ? 'contained' : 'outlined'} color='secondary' startIcon={<ImportExportIcon />} onClick={handleImportCharacter}>
                Import a character
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <List dense>
          {sortedCharacters.map((c) =>
            <ListItem key={c.id} alignItems='flex-start'>
              <ListItemButton onClick={() => handleSelection(c.id)} alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant='body1'>{c.state.name}</Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='text.secondary'>{c.state.game}</Typography>
                  }>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Paper>
  )
}