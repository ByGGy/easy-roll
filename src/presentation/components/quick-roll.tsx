import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { CardContent, Divider } from '@mui/material'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { DiceIcon } from './common/dice-icon'

import { CharacterData } from '../../domain/character/character'

const standardRollExpressions = ['1d4', '1d6', '1d8', '1d20', '1d100']

type Props = {
  character: CharacterData
}

type ValidationResult = {
  isExpressionValid: boolean
  errorMessage: string
  helpMessage: string
}

export const QuickRoll = ({ character }: Props) => {
  const [expression, setExpression] = useState('3d8<12')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  useEffect(() => {
    window.electronAPI.onMessage('Domain.DiceTray.validation', (data: string) => {
      const parserResult = JSON.parse(data)
      setValidationResult({
        isExpressionValid: parserResult.operand !== null,
        errorMessage: parserResult.errorMessage,
        helpMessage: parserResult.helpMessage
      })
    })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(event.target.value)
    window.electronAPI.diceTrayValidate(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleRoll(expression)
    }
  }

  const handleRoll = (expression: string) => {
    window.electronAPI.diceTrayEvaluate(character.id, expression)
  }

  // TODO: Card / CardContent should be added from Popover component instead of repeated
  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 400 }}>
        <CardContent>
          <Stack gap={2}>
            <Grid container alignItems='center'>
              <Grid item xs>
                <Typography variant='h6' color='primary'>Quick Roll</Typography>
              </Grid>
            </Grid>
            <Stack direction='row' gap={2}>
              {standardRollExpressions.map((stdExpression) => 
                <Button key={stdExpression} variant='outlined' color='primary' startIcon={<DiceIcon />} onClick={() => handleRoll(stdExpression)}>
                  {stdExpression}
                </Button>
              )}
            </Stack>
            <Divider />
            <Grid container alignItems='center'>
              <Grid item xs>
                <Typography variant='h6' color='primary'>Custom Expression</Typography>
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
              <Button variant='contained' color='primary' startIcon={<DiceIcon />} onClick={() => handleRoll(expression)}>
                Roll
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}