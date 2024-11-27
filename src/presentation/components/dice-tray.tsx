import { useState, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { DiceIcon } from './common/dice-icon'

import { CharacterData } from '../../domain/character/character'

type Props = {
  character: CharacterData
}

type ValidationResult = {
  isExpressionValid: boolean
  errorMessage: string
  helpMessage: string
}

export const DiceTray = ({ character }: Props) => {
  const [expression, setExpression] = useState('1d20')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  useEffect(() => {
    window.electronAPI.onMessage('Domain.DiceTray.validation', (data: string) => {
      const parseResult = JSON.parse(data)
      setValidationResult({
        isExpressionValid: parseResult.operand !== null,
        errorMessage: parseResult.errorMessage,
        helpMessage: parseResult.helpMessage
      })
    })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(event.target.value)
    window.electronAPI.diceTrayValidate(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRoll()
    }
  }

  const handleRoll = () => {
    window.electronAPI.diceTrayEvaluate(character.id, expression)
  }

  return (
    <Stack padding={2} gap={2}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>Dice Tray</Typography>
        </Grid>
      </Grid>
      <Stack direction='row' gap={2} alignItems='flex-start'>
        <TextField
          type='text'
          value={expression}
          fullWidth
          size='small'
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          error={validationResult !== null && !validationResult.isExpressionValid}
          helperText={validationResult?.errorMessage || validationResult?.helpMessage}
        />
        <Button variant='outlined' color='primary' startIcon={<DiceIcon />} onClick={handleRoll}>
          Roll
        </Button>
      </Stack>
    </Stack>
  )
}