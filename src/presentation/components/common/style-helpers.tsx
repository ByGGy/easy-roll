import ToggleButton from '@mui/material/ToggleButton'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

// TODO: Skin those ugly scrollbars..

export const PrimaryToggleButton = styled(ToggleButton)(props => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: props.theme.palette.primary.main
  }
}))

export const DarkTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))

export const evaluateModifierColor = (value: number) => value < 0 ? 'warning.main' : value > 0 ? 'success.main' : ''