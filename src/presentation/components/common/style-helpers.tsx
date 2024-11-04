import ToggleButton from '@mui/material/ToggleButton'
import { styled } from '@mui/material/styles'

export const PrimaryToggleButton = styled(ToggleButton)(props => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: props.theme.palette.primary.main
  }
}))

export const evaluateModifierColor = (value: number) => value < 0 ? 'warning.main' : value > 0 ? 'success.main' : ''