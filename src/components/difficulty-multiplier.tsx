import Stack from '@mui/material/Stack'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Typography from '@mui/material/Typography'

type Props = {
  value: number
  onChange: (value: number) => void
}

export const DifficultyMultiplier = ({ value, onChange }: Props) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number | null,
  ) => {
    if (value !== null && onChange !== null) {
      onChange(Number(value))
    }
  }

  return (
    <Stack direction="row" spacing={4}>
      <Typography variant='body1' color='secondary'>
        Multiplier
      </Typography>
      <ToggleButtonGroup
        value={value.toString()}
        exclusive
        onChange={handleChange}
      >
        <ToggleButton value='1'>
          <Typography variant='overline' color='text.primary'>x1</Typography>
        </ToggleButton>
        <ToggleButton value='2'>
          <Typography variant='overline' color='text.primary'>x2</Typography>
        </ToggleButton>
        <ToggleButton value='3'>
          <Typography variant='overline' color='text.primary'>x3</Typography>
        </ToggleButton>
        <ToggleButton value='4'>
          <Typography variant='overline' color='text.primary'>x4</Typography>
        </ToggleButton>
        <ToggleButton value='5'>
          <Typography variant='overline' color='text.primary'>x5</Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  )
}