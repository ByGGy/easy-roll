import { useCallback } from 'react'
import Button from '@mui/material/Button'

export const DiscordTest = () => {
  const handleClick = useCallback(async () => {
    try {
      const tmp = await window.electronAPI.testDiscord()
      console.log(JSON.stringify(tmp))
    }
    catch (e) {
      console.log(e)
    }
  }, [])

  return (
    <Button variant='contained' onClick={handleClick}>Roll Dice</Button>
  )
}