import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import PersonIcon from '@mui/icons-material/Person'
import ListItemText from '@mui/material/ListItemText'

import { EntityId, CharacterSheet } from '../../domain/common/types'

export const CharacterSelection = () => {
  const [characterSheets, setCharacterSheets] = useState<Array<CharacterSheet>>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electronAPI.getAllCharacterSheets()
      const sheets = JSON.parse(data)
      setCharacterSheets(sheets)
    }

    fetchData()
  }, [])

  const handleSelection = (id: EntityId) => {
    window.electronAPI.openSession(id)
  }

  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <Typography padding={2} variant='h5' color='primary'>Pick a character</Typography>
        <List dense>
          {characterSheets.sort((sA, sB) => sA.name.localeCompare(sB.name)).map((sheet) =>
            <ListItem key={sheet.id} alignItems='flex-start'>
              <ListItemButton onClick={() => handleSelection(sheet.id)} alignItems='flex-start'>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant='body1'>{sheet.name}</Typography>
                  }
                  secondary={
                    <Typography variant='caption' color='text.secondary'>{sheet.game}</Typography>
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