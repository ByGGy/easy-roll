import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { openSession } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'

import { findGameImagePath } from './common/image-helper'

import { EntityId } from '../../domain/common/types'

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export const SessionSelection = () => {
  const dispatch = useDispatch<AppDispatch>()

  const sessions = useSelector((state: RootState) => state.sessionCollection.sessions)
  const sortedSessions = sessions.toSorted((sA, sB) => new Date(sB.state.creationDate).getTime() - new Date(sA.state.creationDate).getTime())

  const handleCreateAriaSession = () => {
    window.electronAPI.createSession('Aria')
  }

  const handleCreateRddSession = () => {
    window.electronAPI.createSession('Rêve de Dragon')
  }

  const handleSelection = (id: EntityId) => {
    const targetSession = sessions.find(s => s.id === id)
    const payload = {
      sessionId: id,
      characterId: targetSession?.state.characterIds[0]
    }
    dispatch(openSession(payload))
  }

  return (
    <Paper elevation={1}>
      <Box padding={2}>
        <Grid container alignItems='center' >
          <Grid item xs='auto'>
            <Typography padding={2} variant='h5' color='primary'>{sessions.length === 0 ? 'No available sessions' : 'Pick a session'}</Typography>
          </Grid>
          <Grid item xs>
            <Stack direction='row' spacing={2}>
              <Button variant={sessions.length === 0 ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateAriaSession}>
                Create an 'Aria' session
              </Button>
              <Button variant={sessions.length === 0 ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateRddSession}>
                Create a 'Rêve de Dragon' session
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Stack direction='row' padding={2} spacing={2} overflow='auto'>
          {sortedSessions.map((session) =>
            <Card key={session.id} sx={{ minWidth: 300, maxwidth: 400 }} raised>
              <CardActionArea onClick={() => handleSelection(session.id)}>
                <Stack direction='row'>
                  <CardMedia
                    component='img'
                    sx={{ width: 150, objectFit: 'cover' }}
                    image={findGameImagePath(session.state.game)}
                    title='Game'
                  />
                  <CardContent>
                    <Typography variant='body1' color='primary' component='div'>{session.state.name}</Typography>
                    <Typography gutterBottom variant='body2' color='secondary' component='div'>{`${session.state.game}, ${session.state.characterIds.length} characters`}</Typography>
                    <Typography gutterBottom variant='body2' color='text.secondary'>{formatDate(session.state.creationDate)}</Typography>
                    <Typography variant='caption' color='text.secondary' component='div'>{session.state.description}</Typography>
                  </CardContent>
                </Stack>
              </CardActionArea>
            </Card>
          )}
        </Stack>
      </Box>
    </Paper>
  )
}