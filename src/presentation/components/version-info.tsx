import { useState, useEffect } from 'react'

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
    <Typography variant='caption' color='text.disabled'>{`v${version}`}</Typography>
  )
}