import { ReactNode, useState } from 'react'

import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'

type CustomSpeedDialAction = {
  id: string
  icon: ReactNode
}

export type CustomSpeedDialProps = {
  actions: Array<CustomSpeedDialAction>
  onClick: (actionId: string) => void
}

export const CustomSpeedDial = ({ actions, onClick }: CustomSpeedDialProps) => {
  const [open, setOpen] = useState(false)

  const handleClick = (actionId: string) => {
    onClick(actionId)
    setOpen(false)
  }

  return (
    <Stack direction={'row'} spacing={2} alignItems={'center'}>
      <Fab
        size='small'
        color='primary'
        onClick={() => setOpen(!open)}
      >
        <SpeedDialIcon />
      </Fab>
      <Stack
        direction={'row'}
        spacing={1}
      >
        {actions.map((action, index) => 
          <Grow key={action.id} in={open} style={{
              transitionDelay: open
                ? `${index * 25}ms`
                : `${(actions.length - index - 1) * 25}ms`,
            }}>
            <Button onClick={() => handleClick(action.id)}>
              {action.icon}
            </Button>
          </Grow>
        )}
      </Stack>
    </Stack>
  )
}