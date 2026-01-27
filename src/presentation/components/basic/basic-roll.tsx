import { useState, useEffect } from 'react'
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
import { DiceIcon } from '../common/dice-icon'
import { SuccessRate } from '../common/success-rate'

import { unreachable } from '../../../domain/common/tools'
import { EntityId } from '../../../domain/common/types'

type BasicRollStat = 'Attribute' | 'Ability'

const DEFAULT_DIFFICULTY = 1
const DEFAULT_MODIFIER = 0

type Props = {
  characterId: EntityId
  rollStat: BasicRollStat
  statName: string
  initDifficulty?: number
  initModifier?: number
}

export const BasicRoll = ({ characterId, rollStat, statName, initDifficulty= DEFAULT_DIFFICULTY, initModifier= DEFAULT_MODIFIER }: Props) => {
  const [difficulty, setDifficulty] = useState(initDifficulty)
  const [modifier, setModifier] = useState(initModifier)
  const [successRatio, setSuccessRatio] = useState(0)

  useEffect(() => {
    switch (rollStat) {
      default:
        unreachable(rollStat)
        break

      case 'Attribute':
        window.electronAPI.evaluateCharacterSuccessRatio({
          game: 'BaSIC',
          characterId,
          kind: 'basicCheckAttribute',
          attributeName: statName,
          modifier
        })
        break
      
      case 'Ability':
        window.electronAPI.evaluateCharacterSuccessRatio({
          game: 'BaSIC',
          characterId,
          kind: 'basicCheckAbility',
          abilityName: statName,
          difficulty,
          modifier
        })
        break
    }
  }, [difficulty, modifier])

  useEffect(() => {
    window.electronAPI.onMessage('Domain.Basic.successRatio', setSuccessRatio)
  }, [])

  const handleReset = () => {
    setDifficulty(DEFAULT_DIFFICULTY)
    setModifier(DEFAULT_MODIFIER)
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

  // TODO: should dispatch store actions instead of calling electronAPI in the components ?
  const handleRoll = () => {
    switch (rollStat) {
      default:
        unreachable(rollStat)
        break

      case 'Attribute':
        window.electronAPI.checkCharacter({
          game: 'BaSIC',
          characterId,
          kind: 'basicCheckAttribute',
          attributeName: statName,
          modifier
        })
        break
      
      case 'Ability':
        window.electronAPI.checkCharacter({
          game: 'BaSIC',
          characterId,
          kind: 'basicCheckAbility',
          abilityName: statName,
          difficulty,
          modifier
        })
        break
    }
  }

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 400 }}>
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
          <Grid container alignItems='center'>
            <Grid item xs>
              <Stack gap={4}>
                { rollStat === 'Ability' &&
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
                      <PrimaryToggleButton value='2'>facile</PrimaryToggleButton>
                      <PrimaryToggleButton value='1'>normal</PrimaryToggleButton>
                      <PrimaryToggleButton value='0.5'>difficile</PrimaryToggleButton>
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
            </Grid>
            <Grid item xs='auto' ml={2}>
              <SuccessRate ratio={successRatio} />
            </Grid>
          </Grid>                 
        </CardContent>
        <CardActions>
          <Button variant='contained' color='primary' startIcon={<DiceIcon />} onClick={handleRoll} fullWidth>
            Roll
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}