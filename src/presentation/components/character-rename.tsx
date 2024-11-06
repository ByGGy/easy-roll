import { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { CardContent, CardActions } from '@mui/material'

import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

export const CharacterRename = ({ character }: Props) => {
  const [newName, setNewName] = useState(character.state.name) 

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(event.target.value)
  }

  const handleRename = () => {
    window.electronAPI.renameCharacter(character.id, newName)
  }

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 300 }}>
        <CardContent>
          <TextField label='New name' variant='standard' autoFocus value={newName} onChange={handleChange}/>
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' onClick={handleRename} fullWidth>
            Rename
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}