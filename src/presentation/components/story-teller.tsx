import { useState, useEffect, useRef } from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

type Paragraph = {
  name: string
  content: string
}

export const StoryTeller = () => {
  const [nextMessage, setNextMessage] = useState('')
  const [discussion, setDiscussion] = useState<Array<Paragraph>>([])
  const stackRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    window.electronAPI.onMessage('Domain.StoryTeller.tell', (data: string) => {
      setDiscussion((previousDiscussion) => [...previousDiscussion, { name: 'me', content: data }])
    })

    window.electronAPI.onMessage('Domain.StoryTeller.answer', (data: string) => {
      setDiscussion((previousDiscussion) => [...previousDiscussion, { name: 'storyteller', content: data }])
    })
  }, [])

  useEffect(() => {
    if (stackRef.current) {
      stackRef.current.scrollTo({
        top: stackRef.current.scrollHeight,
        behavior: 'smooth',
      })
      // stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
  }, [discussion])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNextMessage(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      window.electronAPI.chatWithStoryTeller(nextMessage)
      setNextMessage('')
    }
  }

  return (
    <Stack padding={2} gap={2} maxWidth='500px' height='100%' overflow='hidden'>
      <Stack sx={{ flex: 1, overflow: 'auto' }} gap={1} ref={stackRef}>
        {discussion.map((item, index) =>
        <Card key={index} raised sx={{ flexShrink: 0 }}>
          <CardContent>
            <Typography variant='body1' color='primary' component='div'>{item.name}</Typography>
            {item.content.split('\n').map((l, index) => <Typography key={index} gutterBottom variant='body2'>{l}</Typography>)}
          </CardContent>
        </Card>
        )}
      </Stack>
      <TextField
        type='text'
        value={nextMessage}
        fullWidth
        size='small'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </Stack>
  )
}