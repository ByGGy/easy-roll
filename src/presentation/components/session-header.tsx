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
        <Box>
          <Grid container alignItems='flex-end'>
            <Grid item xs='auto'>
              <Stack direction='row' alignItems='center' padding={2}>
                <Typography variant='h5' mr={1}>{session.state.name}</Typography>
                <EditText fieldLabel='New Name' fieldValue={session.state.name} actionLabel='Rename' onApply={handleRename} />
              </Stack>
            </Grid>
            <Grid item xs='auto'>
              <Typography padding={2} variant='subtitle1' color='text.secondary'>{session.state.game}</Typography>
            </Grid>
            <Grid item xs>
              <Typography padding={2} variant='caption' color='text.secondary'>{session.state.description}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  )
}