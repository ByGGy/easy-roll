import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store/store'
import { openSession } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'

import { findGameImagePath } from './common/image-helper'
import { CustomSpeedDial } from './common/speed-dial'

import { EntityId, Game } from '../../domain/common/types'

const games: Array<Game> = ['Aria', 'BaSIC', 'Deadlands', 'Rêve de Dragon']

type GamePreviewProps = {
  game: Game
}

const GamePreview = ({ game }: GamePreviewProps) => {
  return (
    <Card raised>
      <Stack direction='row'>
        <CardMedia
          component='img'
          sx={{ width: 50, objectFit: 'cover' }}
          image={findGameImagePath(game)}
          title='Game'
        />
        <CardContent sx={{ textAlign: 'left' }}>
          <Typography variant='caption' component='div'>{game}</Typography>
          <Typography variant='caption'>...</Typography>
        </CardContent>
      </Stack>
    </Card>
  )
}

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

  const createActions = useMemo(() => {
    return games.map(game => ({ id: game, icon: <GamePreview game={game} /> }))
  }, [])

  const handleCreateAction = (game: Game) => {
    window.electronAPI.createSession(game)
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
    <Stack spacing={1}>
      <Grid container alignItems='center'>
        <Grid item xs='auto'>
          <Typography variant='h5' color='primary' mr={2}>Sessions</Typography>
        </Grid>
        <Grid item xs='auto'>
          <CustomSpeedDial actions={createActions} onClick={handleCreateAction} />
        </Grid>
      </Grid>
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