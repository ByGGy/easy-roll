import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { openSession } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
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

  const handleSelection = (id: EntityId) => {
    const targetSession = sessions.find(s => s.id === id)
    const payload = {
      sessionId: id,
      characterId: targetSession?.state.characterIds[0]
    }
    dispatch(openSession(payload))
  }

  return (
    <Stack spacing={1}>
      <Typography variant='h5' color='primary'>Sessions</Typography>
      {sortedSessions.length === 0 &&
        <Typography color='text.disabled'>No session found, create one first.</Typography>
      }
      <Stack direction='row' sx={{ flexWrap: 'wrap' }}>
        {sortedSessions.length > 0 && sortedSessions.map((session) =>
          <Box key={session.id} margin={1}>
            <Card raised>
              <CardActionArea onClick={() => handleSelection(session.id)}>
                <Stack direction='row'>
                  <CardMedia
                    component='img'
                    sx={{ width: 150, objectFit: 'cover' }}
                    image={findGameImagePath(session.state.game)}
                    title='Game'
                  />
                  <CardContent>
                    <Typography variant='body1' component='div'>{session.state.name}</Typography>
                    <Typography gutterBottom variant='body2' color='text.secondary'>{formatDate(session.state.creationDate)}</Typography>
                    <Typography gutterBottom variant='body2' color='secondary' component='div'>{`${session.state.game}, ${session.state.characterIds.length} characters`}</Typography>
                    <Typography variant='caption' color='text.secondary' component='div'>{session.state.description}</Typography>
                  </CardContent>
                </Stack>
              </CardActionArea>
            </Card>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}