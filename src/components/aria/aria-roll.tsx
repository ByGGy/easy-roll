import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { CardContent, CardActions } from '@mui/material'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'
import { styled } from '@mui/material/styles'
import { evaluateModifierColor } from '../common/style-helpers'

type AriaRollStat = 'Attribute' | 'Ability'

type Props = {
  rollStat: AriaRollStat
  statName: string
}

const PrimaryToggleButton = styled(ToggleButton)(props => ({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: props.theme.palette.primary.main
  }
}))

export const AriaRoll = ({ rollStat, statName }: Props) => {
  const [difficulty, setDifficulty] = useState(3)
  const [modifier, setModifier] = useState(0)

  const handleReset = () => {
    setDifficulty(3)
    setModifier(0)
  }

  const handleDifficultyChange = (
    event: React.MouseEvent<HTMLElement>,
    value: number | null,
  ) => {
    if (value !== null) {
      setDifficulty(Number(value))
    }
  }

  const handleModifierChange = (event: Event, newValue: number | number[]) => {
    setModifier(newValue as number)
  }

  const handleRoll = useCallback(() => {
    switch (rollStat) {
      case 'Attribute': 
        window.electronAPI.ariaCheckAttribute(statName, difficulty, modifier)
        break
      
      case 'Ability':
        window.electronAPI.ariaCheckAbility(statName, modifier)
        break
    }
  }, [rollStat, statName, difficulty, modifier])

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 300 }}>
        <Grid container alignItems='center'>
          <Grid item xs>
            <Typography variant='h5'>{statName}</Typography>
          </Grid>
          <Grid item xs='auto'>
            <Button onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </Button>
          </Grid>
        </Grid>
        <CardContent>
          <Stack direction='column' spacing={2}>
            { rollStat === 'Attribute' &&
              <Stack direction='row' spacing={4} alignItems='center'>
                <Typography variant='button' color='primary'>
                  Multiplier
                </Typography>
                <ToggleButtonGroup
                  value={difficulty.toString()}
                  exclusive
                  onChange={handleDifficultyChange}
                  size='small'
                >
                  <PrimaryToggleButton value='1'>
                    <Typography>x1</Typography>
                  </PrimaryToggleButton>
                  <PrimaryToggleButton value='2'>
                    <Typography>x2</Typography>
                  </PrimaryToggleButton>
                  <PrimaryToggleButton value='3'>
                    <Typography>x3</Typography>
                  </PrimaryToggleButton>
                  <PrimaryToggleButton value='4'>
                    <Typography>x4</Typography>
                  </PrimaryToggleButton>
                  <PrimaryToggleButton value='5'>
                    <Typography>x5</Typography>
                  </PrimaryToggleButton>
                </ToggleButtonGroup>
              </Stack>
            }
            <Stack />
            <Stack />
            <Stack direction='row' spacing={4}>
                <Typography variant='button' color='primary'>
                  Modifier
                </Typography>
                <Slider
                  value={modifier}
                  onChange={handleModifierChange}
                  min={-30}
                  max={+30}
                  step={10}
                  marks
                  valueLabelDisplay='on'
                  sx={{
                    color: evaluateModifierColor(modifier)
                  }}
                />
            </Stack>
          </Stack>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}