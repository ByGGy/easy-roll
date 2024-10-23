import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import { DiscordIcon } from './common/discord-icon'

export const DiscordConfiguration = () => {
  const isEnabled = useSelector((state: RootState) => state.discord.isEnabled)

  const handleEnableChange = () => {
    window.electronAPI.toggleDiscordNotification(!isEnabled)
  }

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