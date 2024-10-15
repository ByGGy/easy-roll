import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import ContactPageIcon from '@mui/icons-material/ContactPage'

import { CharacterSheet } from '../domain/character/characterSheet'
import { EntityId } from '../domain/common/types'

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
        <Paper elevation={2}>
          <Typography padding={2} variant='h4'>
            <Box sx={{ fontWeight: 'bold' }}>Pick a character</Box>
          </Typography>
          <List dense>
            {characterSheets.sort((sA, sB) => sA.name.localeCompare(sB.name)).map((sheet) =>
              <ListItem key={sheet.id}>
                <ListItemButton onClick={() => handleSelection(sheet.id)} alignItems='flex-start'>
                  <ListItemIcon sx={{ color: 'secondary.main' }}>
                    <ContactPageIcon fontSize='large'/>
                  </ListItemIcon>
                  <ListItemText primary={
                    <Typography variant='h5' color='primary'>
                      {sheet.name}
                    </Typography>
                  } secondary={
                    <Typography variant='subtitle1' color='primary.dark' >
                      {sheet.game}
                    </Typography>}>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Paper>
  )
}