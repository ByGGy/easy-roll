import * as React from 'react'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'

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
      <Button aria-describedby={id} variant='outlined' onClick={handleClick}>
        {triggerContent}
      </Button>
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