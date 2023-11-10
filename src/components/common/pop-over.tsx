import * as React from 'react'
import Popover from '@mui/material/Popover'
import IconButton from '@mui/material/IconButton'

type Props = {
  triggerContent: React.ReactNode
  popoverContent: React.ReactNode
}

export const BasicPopover = ({ triggerContent, popoverContent }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick} color='secondary'>
        {triggerContent}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        {popoverContent}
      </Popover>
    </div>
  )
}