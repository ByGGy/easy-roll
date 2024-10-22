import { useState, useEffect } from 'react'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { DiscordIcon } from './common/discord-icon'

export const DiscordConfiguration = () => {
  // TODO: doesn't work in some scenarios, e.g. when the component is unmounted / remounted, it might be desynchronized with the domain state
  // we could "fetch" the current domain state to initialize the component on mount (like we were doin previously)
  // or we could update a redux store from electronAPI.onMessage, and use the store state to initialize the component local state
  const [isEnabled, setIsEnabled] = useState(false)

  const handleEnableChange = () => {
    window.electronAPI.toggleDiscordNotification(!isEnabled)
  }

  useEffect(() => {
    window.electronAPI.onMessage('Domain.Discord.update', (data: string) => {
      const states = JSON.parse(data)
      setIsEnabled(states.current.isEnabled)
    })
  }, [])

  return (
    <Fab variant='extended' size='medium' onClick={handleEnableChange}
        sx={{
          backgroundColor: 'background.default'
        }}
    >
      <DiscordIcon sx={{ mr: 1 }}/>
      <Typography variant='button' fontWeight='bold' 
        sx={{
          color: isEnabled ? 'error.main' : 'grey.800',
          textShadow: isEnabled ? '0 0 10px rgba(255, 0, 0, 0.9)' : '',  // Glow effect
        }}
        >
        ON AIR !
      </Typography>
    </Fab>
  )
}