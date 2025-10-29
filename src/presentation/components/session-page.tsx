import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import Typography from '@mui/material/Typography'

import { SessionHeader } from './session-header'
import { CharacterSelection } from './character-selection'
import { CharacterPage } from './character-page'
import { RollHistory } from './roll-history'

export const SessionPage = () => {
  const sessions = useSelector((state: RootState) => state.sessionCollection.sessions)
  const sessionId = useSelector((state: RootState) => state.selection.sessionId)
  const session = sessions.find(c => c.id === sessionId)

  const characters = useSelector((state: RootState) => state.characterCollection.characters)
  const characterId = useSelector((state: RootState) => state.selection.characterId)
  const character = characters.find(c => c.id === characterId)

  if (session) {
    return (
      <Stack direction={'row'} spacing={1} height='100%' overflow='hidden'>
        <Paper elevation={2}>
          <Stack spacing={1} padding={2} height='100%' overflow='hidden' sx={{ minWidth: 400 }}>
            <SessionHeader session={session} />
            <CharacterSelection session={session} />
          </Stack>
        </Paper>
        <Paper elevation={2}>
          {character && <CharacterPage game={session.state.game} character={character} />}
          {!character &&
            <Stack direction='row' padding={2} spacing={2} sx={{ minWidth: 400 }} alignItems='center'>
              <Avatar sx={{ bgcolor: 'info.dark' }}>
                <QuestionMarkIcon />
              </Avatar>
              <Typography color='text.disabled'>No character selected.</Typography>
            </Stack>
          }
        </Paper>
        <RollHistory />
      </Stack>
    )
  }

  return <p>Session not found..</p>
}
