import React, { useState, useEffect } from 'react'

import Stack from '@mui/material/Stack'
import Typography, { TypographyOwnProps } from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

type EditableType = string | number

type Props<T> = {
  variant?: TypographyOwnProps['variant']
  color?: TypographyOwnProps['color']
  initialValue: T
  onApply: (newValue: T) => void
}

export const EditValue = <T extends EditableType>({ variant, color, initialValue, onApply }: Props<T>) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [editValue, setEditValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
    updateIsEditing(initialValue)
  }, [initialValue])

  const updateIsEditing = (value: T) => {
    setIsEditing(value === '')
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleStartEditing = () => {
    setEditValue(value)
    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: forcing type assertion is ugly..
    setEditValue((typeof initialValue === 'number' ? Number.parseInt(event.target.value) : event.target.value) as T)
  }

  const handleBlur = () => {
    setValue(editValue)
    onApply(editValue)
    updateIsEditing(editValue)
  }

  const handleTextFieldKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setValue(editValue)
      onApply(editValue)
      updateIsEditing(editValue)
    } else if (event.key === 'Escape') {
      setEditValue(value)
      updateIsEditing(value)
    }
  }

  const handleTypoKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleStartEditing()
    }
  }

  return (
    <Stack direction='row' alignItems='center' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {isEditing ? (
        <TextField
          type={typeof initialValue === 'number' ? 'number' : 'text'}
          value={editValue}
          variant='standard'
          autoFocus
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleTextFieldKeyDown}
          size='small'
          sx={{
            width: '100%',
            '.MuiInputBase-root': {
              fontSize: 'inherit',
              padding: '0px',
            },
          }}
        />
      ) : (
        <Typography tabIndex={0} variant={variant} color={color} mr={1} onDoubleClick={handleStartEditing} onKeyDown={handleTypoKeyDown} sx={{ cursor: 'pointer' }}>
          {value}
        </Typography>
      )}
      <IconButton
        size='small'
        onClick={handleStartEditing}
        sx={{ visibility: isHovered && !isEditing ? 'visible' : 'hidden' }}
      >
        <EditIcon fontSize='small' color='secondary' />
      </IconButton>
    </Stack>
  )
}