import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store/store'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

import { toggleTorchOverlay } from '../store/uiOptionsSlice'

export const TorchSwitch = () => {
  const dispatch = useDispatch<AppDispatch>()
  const isEnabled = useSelector((state: RootState) => state.uiOptions.isTorchOverlayEnabled)

  const handleClick = () => {
    dispatch(toggleTorchOverlay())
  }

  return (
    <Box sx={{
      '& .torch-feedback': {
        color: (theme) => isEnabled ? theme.palette.primary.main : theme.palette.text.disabled,
      }
    }}>
      <IconButton className='torch-feedback' onClick={handleClick}>
        <LocalFireDepartmentIcon fontSize='small' />
      </IconButton>
    </Box>
  )
}

export const VersionInfo = () => {
  const [version, setVersion] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electronAPI.getAppVersion()
      setVersion(data)
    }

    fetchData()
  }, [])

  return (
    <Stack direction='row' columnGap={1} alignItems='center'>
      <TorchSwitch />
      <Typography variant='caption' color='text.disabled'>{`v${version}`}</Typography>
    </Stack>
  )
}