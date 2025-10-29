import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'
import { closeSession } from '../store/selectionSlice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import AddIcon from '@mui/icons-material/Add'
import LogoutIcon from '@mui/icons-material/Logout'

import { VersionInfo } from './version-info'

export const AppHeader = () => {
  const dispatch = useDispatch<AppDispatch>()

  const sessions = useSelector((state: RootState) => state.sessionCollection.sessions)
  const noSessionFound = sessions.length === 0

  const sessionId = useSelector((state: RootState) => state.selection.sessionId)
  const isSessionSelected = sessionId !== null

  const handleCreateAriaSession = () => {
    window.electronAPI.createSession('Aria')
  }

  const handleCreateRddSession = () => {
    window.electronAPI.createSession('Rêve de Dragon')
  }

  const handleCreateBasicSession = () => {
    window.electronAPI.createSession('BaSIC')
  }

  const handleCloseSession = () => {
    dispatch(closeSession())
  }

  return (
    <AppBar position='static' color='transparent' enableColorOnDark>
      <Toolbar>
        <Box flexGrow={1}>
          {isSessionSelected &&
            <Button variant='outlined' startIcon={<LogoutIcon />} onClick={handleCloseSession}>
              Back
            </Button>
          }
          {!isSessionSelected &&
            <Stack direction='row' spacing={2}>
              <Button variant={noSessionFound ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateAriaSession}>
                Create an 'Aria' session
              </Button>
              <Button variant={noSessionFound ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateRddSession}>
                Create a 'Rêve de Dragon' session
              </Button>
              <Button variant={noSessionFound ? 'contained' : 'outlined'} startIcon={<AddIcon />} onClick={handleCreateBasicSession}>
                Create a 'BaSIC' session
              </Button>
            </Stack>
          }
        </Box>
        <VersionInfo />
      </Toolbar>
    </AppBar>
  )
}