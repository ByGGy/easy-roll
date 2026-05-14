import { useState } from 'react'

import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import StyleIcon from '@mui/icons-material/Style'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'

import { IconPopover } from './common/pop-over'

import { CharacterData } from '../../domain/character/character'

type CreateTagProps = {
  onApply: (newTag: string) => void
}

export const CreateTag = ({ onApply }: CreateTagProps) => {
  const [newTag, setNewTag] = useState('') 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(event.target.value)
  }

  const handleTextFieldKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onApply(newTag)
      setNewTag('')
    }
  }

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 300 }}>
        <CardContent>
          <TextField label='New tag' variant='standard' autoFocus value={newTag} onChange={handleChange} onKeyDown={handleTextFieldKeyDown}/>
        </CardContent>
      </Box>
    </Card>
  )
}

type Props = {
  character: CharacterData
}

export const CharacterTags = ({ character }: Props) => {

  const handleCreate = (newTag: string) => {
    const newTags = new Set(character.state.tags)
    newTags.add(newTag)
    window.electronAPI.changeCharacterTags(character.id, [...newTags])
  }

  const handleDelete = (tag: string) => {
    const newTags = character.state.tags.filter(t => t !== tag)
    window.electronAPI.changeCharacterTags(character.id, [...newTags])
  }

  return (
    <Stack spacing={1} paddingLeft={2} paddingRight={2} direction='row' alignItems='center'>
      <Typography variant='subtitle2' color='primary'>Tags</Typography>
      {character.state.tags.map(tag => <Chip label={tag}  variant='outlined' onDelete={() => handleDelete(tag)} />)}
      <IconPopover direction='down-left' triggerContent={<StyleIcon color='primary' />} popoverContent={<CreateTag onApply={handleCreate} />} />
    </Stack>
  )
}