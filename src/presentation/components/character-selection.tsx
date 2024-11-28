import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { pickCharacter } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { CardContent } from '@mui/material'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import ColorizeIcon from '@mui/icons-material/Colorize'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
// @ts-ignore
import Jdenticon from 'react-jdenticon'
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove'
import ListItemText from '@mui/material/ListItemText'

import { BasicPopover } from './common/pop-over'
import { DarkTooltip } from './common/style-helpers'

import { isNotUndefined } from '../../domain/common/tools'
import { EntityId } from '../../domain/common/types'
import { SessionData } from '../../domain/session/session'

type AddCharacterProps = {
  characterIds: Array<EntityId>
  handleSelection: (id: EntityId) => void
}

const AddCharacter = ({ characterIds, handleSelection }: AddCharacterProps) => {
  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const relevantCharacters = allCharacters.filter(c => characterIds.some(id => id === c.id))
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
          {sortedCharacters.length > 0 &&
            <List dense>
              {sortedCharacters.map((c) =>
                <ListItem key={c.id}>
                  <ListItemButton onClick={() => handleSelection(c.id)}>
                    <ListItemAvatar>
                      <Avatar>
                        <Jdenticon value={c.state.name} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={
                      <Typography variant='body1'>{c.state.name}</Typography>
                    } />
                  </ListItemButton>
                </ListItem>
              )}
            </List>
          }
          {relevantCharacters.length === 0 && <Typography color='text.disabled'>No character left to pick.</Typography>}
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
  const selectedCharacterId = useSelector((state: RootState) => state.selection.characterId)

  const availableCharactersToPick = allCharacters.filter(c => relevantCharacters.every(r => r.id !== c.id) && c.state.tags.includes(session.state.game))

  const handleCreateCharacter = () => {
    window.electronAPI.createCharacterForSession(session.id)
  }

  const handleAddCharacter = (id: EntityId) => {
    window.electronAPI.addCharacterToSession(session.id, id)
  }

  const handleRemoveCharacter = (id: EntityId) => {
    window.electronAPI.removeCharacterFromSession(session.id, id)
  }

  const handleImportCharacter = () => {
    window.electronAPI.tryImportCharacterForSession(session.id)
  }

  const handleSelection = (id: EntityId) => {
    dispatch(pickCharacter(id))
  }

  return (
    <Stack padding={2} height='100%' overflow='hidden'>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary' mr={2}>Characters</Typography>
        </Grid>
        <Grid item xs='auto'>
          <Stack direction='row'>
            <DarkTooltip title='Create a new character'>
              <IconButton color='primary' onClick={handleCreateCharacter}>
                <NoteAddIcon />
              </IconButton>
            </DarkTooltip>
            <BasicPopover
              triggerContent={
                <DarkTooltip title='Pick an existing character'>
                  <Badge badgeContent={availableCharactersToPick.length} color='secondary'
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                  >
                    <ColorizeIcon color='primary' />
                  </Badge>
                </DarkTooltip>
              }
              popoverContent={<AddCharacter characterIds={availableCharactersToPick.map(c => c.id)} handleSelection={handleAddCharacter} />}
            />
            <DarkTooltip title='Import a character from a file'>
              <IconButton color='secondary' onClick={handleImportCharacter}>
                <UploadFileIcon />
              </IconButton>
            </DarkTooltip>
          </Stack>
        </Grid>
      </Grid>
      {sortedCharacters.length > 0 &&
        <List dense sx={{ flex: 1, overflow: 'auto' }}>
          { sortedCharacters.map((c) =>
            <ListItem
              key={c.id}
              sx={{
                '& .secondary-action': {
                  visibility: 'hidden',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                },
                '&:hover .secondary-action': {
                  visibility: 'visible',
                  opacity: 1,
                },
              }}
              secondaryAction={
                <IconButton edge='end' aria-label='remove' className='secondary-action' color='secondary' size='small' onClick={() => handleRemoveCharacter(c.id)}>
                  <PlaylistRemoveIcon />
                </IconButton>
              }
            >
              <ListItemButton onClick={() => handleSelection(c.id)}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: c.id === selectedCharacterId ? 'text.primary' : '' }}>
                    <Jdenticon value={c.state.name} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={
                  <Typography color={c.id === selectedCharacterId ? '' : 'text.secondary'} variant='body1'>{c.state.name}</Typography>
                } />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      }
      {relevantCharacters.length === 0 && <Typography color='text.disabled'>No character found, add one first.</Typography>}
    </Stack>
  )
}