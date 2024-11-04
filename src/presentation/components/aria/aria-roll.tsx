import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { CardContent, CardActions } from '@mui/material'
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore'

import { PrimaryToggleButton, evaluateModifierColor } from '../common/style-helpers'

type AriaRollStat = 'Attribute' | 'Ability'

type Props = {
  rollStat: AriaRollStat
  statName: string
}

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

  // TODO: should dispatch a store action instead of calling the electronAPI in the components ?
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
            <Typography variant='h6' color='primary'>{statName}</Typography>
          </Grid>
          <Grid item xs='auto'>
            <IconButton color='secondary' onClick={handleReset}>
              <SettingsBackupRestoreIcon />
            </IconButton>
          </Grid>
        </Grid>
        <CardContent>
          <Stack gap={4}>
            { rollStat === 'Attribute' &&
              <Box>
                <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
                  <Typography color='text.secondary'>Multiplier</Typography>
                  <Typography variant='body2'>{`x${difficulty}`}</Typography>
                </Stack>
                <ToggleButtonGroup
                  value={difficulty.toString()}
                  exclusive
                  onChange={handleDifficultyChange}
                  size='small'
                >
                  <PrimaryToggleButton value='1'>x1</PrimaryToggleButton>
                  <PrimaryToggleButton value='2'>x2</PrimaryToggleButton>
                  <PrimaryToggleButton value='3'>x3</PrimaryToggleButton>
                  <PrimaryToggleButton value='4'>x4</PrimaryToggleButton>
                  <PrimaryToggleButton value='5'>x5</PrimaryToggleButton>
                </ToggleButtonGroup>
              </Box>
            }
            <Box>
              <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
                <Typography color='text.secondary'>Modifier</Typography>
                <Typography variant='body2'>{`${modifier > 0 ? '+' :''}${modifier}`}</Typography>
              </Stack>
              <Slider
                value={modifier}
                onChange={handleModifierChange}
                min={-30}
                max={+30}
                step={10}
                marks
                sx={{
                  color: evaluateModifierColor(modifier)
                }}
              />
            </Box>
          </Stack>
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}