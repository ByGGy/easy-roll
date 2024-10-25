import { useState, useEffect } from 'react'

import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

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
    <Paper elevation={1}>
      <Box display='flex' justifyContent='flex-end' padding={1}>
        <Typography variant='caption' color='secondary'>{`v${version}`}</Typography>
      </Box>
    </Paper>
  )
}