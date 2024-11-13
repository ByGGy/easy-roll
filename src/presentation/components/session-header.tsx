import { useDispatch } from 'react-redux'
import { AppDispatch } from '../store/store'
import { closeSession } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'

import { EditText } from './common/edit-text'

import { findGameImagePath } from './common/image-helper'

import { SessionData } from '../../domain/session/session'

type Props = {
  session: SessionData
}

export const SessionHeader = ({ session }: Props) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleRename = (newName: string) => {
    window.electronAPI.renameSession(session.id, newName)
  }

  const handleCloseSession = () => {
    dispatch(closeSession())
  }

  return (
    <Grid container alignItems='center'>
      <Grid item xs='auto'>
        <Button variant='outlined' startIcon={<LogoutIcon />} onClick={handleCloseSession}>
          Back
        </Button>
      </Grid>
      <Grid item xs>
        <Stack direction='row' ml={1} padding={1}>
          <Box
            component='img'
            sx={{ width: 50, objectFit: 'cover', borderRadius: 1 }}
            src={findGameImagePath(session.state.game)}
            alt='Game'
          />
          <Box ml={1}>
            <Stack direction='row' alignItems='center'>
              <Typography variant='h5' mr={1}>{session.state.name}</Typography>
              <EditText fieldLabel='New Name' fieldValue={session.state.name} actionLabel='Rename' onApply={handleRename} />
            </Stack>
            <Typography variant='caption' color='text.secondary'>{session.state.description}</Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  )
}