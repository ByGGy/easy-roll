import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { CardContent, CardActions } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

import { BasicPopover } from './pop-over'

type Props = {
  fieldLabel: string
  fieldValue: string
  actionLabel: string
  onApply: (newValue: string) => void
}

export const OldEditText = ({ fieldLabel, fieldValue, actionLabel, onApply }: Props) => {
  const [newValue, setNewValue] = useState(fieldValue) 

  useEffect(() => {
    setNewValue(fieldValue)
  }, [fieldValue])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewValue(event.target.value)
  }

  const handleBlurTest = (event: React.FocusEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }

  const handleApply = () => {
    onApply(newValue)
  }

  return (
    <BasicPopover
      triggerContent={<EditIcon color='secondary' fontSize='small' />}
      popoverContent={
        <Card>
          <Box padding={2} sx={{ minWidth: 300 }}>
            <CardContent>
              <TextField label={fieldLabel} variant='standard' autoFocus value={newValue} onChange={handleChange} onBlur={handleBlurTest}/>
            </CardContent>
            <CardActions>
              <Button variant='contained' color='primary' onClick={handleApply} fullWidth>{actionLabel}</Button>
            </CardActions>
          </Box>
        </Card>
      }
    />
  )
}