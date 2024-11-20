import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography, { TypographyOwnProps } from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

type Props = {
  variant?: TypographyOwnProps['variant']
  initialText: string
  onApply: (newValue: string) => void
}

export const EditText = ({ variant, initialText, onApply }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(initialText)
  const [editedText, setEditedText] = useState(initialText)

  useEffect(() => {
    setText(initialText)
    updateIsEditing(initialText)
  }, [initialText])

  useEffect(() => {
    onApply(text)
  }, [text])

  const updateIsEditing = (value: string) => {
    setIsEditing(value === '')
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleStartEditing = () => {
    setEditedText(text)
    setIsEditing(true)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedText(event.target.value)
  }

  const handleBlur = () => {
    setText(editedText)
    updateIsEditing(editedText)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setText(editedText)
      updateIsEditing(editedText)
    } else if (event.key === 'Escape') {
      setEditedText(text)
      updateIsEditing(text)
    }
  }

  return (
    <Box
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isEditing ? (
        <TextField
          value={editedText}
          variant='standard'
          autoFocus
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          size='small'
          sx={{ width: '100%' }}
        />
      ) : (
        <Stack direction='row' alignItems='center'>
          <Typography variant={variant} mr={1} onDoubleClick={handleStartEditing} sx={{ cursor: 'pointer' }}>
            {text}
          </Typography>
          <IconButton
            size="small"
            onClick={handleStartEditing}
            sx={{ visibility: isHovered ? "visible" : "hidden" }}
          >
            <EditIcon fontSize="small" color='secondary' />
          </IconButton>
        </Stack>
      )}
    </Box>
  )
}