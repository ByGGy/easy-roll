import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { closeSession } from '../store/selectionSlice'

import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import LogoutIcon from '@mui/icons-material/Logout'

import { EzRollIcon } from './common/ezRoll-icon'
import { VersionInfo } from './version-info'

export const AppHeader = () => {
  const dispatch = useDispatch<AppDispatch>()

  const sessionId = useSelector((state: RootState) => state.selection.sessionId)
  const isSessionSelected = sessionId !== null

  const handleCloseSession = () => {
    dispatch(closeSession())
  }

  return (
    <AppBar position='static' color='transparent' enableColorOnDark>
      <Toolbar>
        <Stack direction='row' alignItems='center' flex={1}>
          <EzRollIcon sx={{ width: '4em', color: (theme) => theme.palette.text.disabled, mr: 4 }} />
          {isSessionSelected &&
            <Button variant='outlined' startIcon={<LogoutIcon />} onClick={handleCloseSession}>
              Back
            </Button>
          }
        </Stack>
        <VersionInfo />
      </Toolbar>
    </AppBar>
  )
}