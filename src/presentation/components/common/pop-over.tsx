import * as React from 'react'
import Popover from '@mui/material/Popover'
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton'
import { unreachable } from '../../../domain/common/tools'

type Direction = 'down' | 'right'

type Props = {
  direction?: Direction
  size?: IconButtonOwnProps['size']
  triggerContent: React.ReactNode
  popoverContent: React.ReactNode
}

export const BasicPopover = ({ direction ='down', size, triggerContent, popoverContent }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const anchorProps = React.useMemo(() => {
    switch (direction) {
      default:  return unreachable(direction)
      case 'down':
        return {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',            
          }
        } as const
      case 'right':
        return {
          anchorOrigin: {
            vertical: 'center',
            horizontal: 'right'
          },
          transformOrigin: {
            vertical: 'center',
            horizontal: 'left',            
          }
        } as const
    }
  }, [direction])

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <>
      <IconButton size={size} aria-describedby={id} onClick={handleClick}>
        {triggerContent}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        {...anchorProps}
      >
        {popoverContent}
      </Popover>
    </>
  )
}