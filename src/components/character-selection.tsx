import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
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
          <Typography padding={2} variant='h4' color='primary'>
            <Box sx={{ fontWeight: 'bold' }}>Select a character</Box>
          </Typography>
          <List dense>
            {characterSheets.sort((sA, sB) => sA.name.localeCompare(sB.name)).map((sheet) =>
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleSelection(sheet.id)} color='secondary'>
                    <ContactPageIcon />
                  </IconButton>
                }
              >
              <Grid container alignItems='center' spacing={4}>
                <Grid item xs>
                  <Typography variant='body1' color='primary'>
                    {sheet.name}
                  </Typography>
                </Grid>
                <Grid item xs='auto' paddingRight={2}>
                  <Typography variant='body1' >
                    {'game'}
                  </Typography>
                </Grid>
              </Grid>
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>
    </Paper>
  )
}