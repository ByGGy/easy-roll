import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import Typography from '@mui/material/Typography'

import { SessionHeader } from './session-header'
import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'
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
      <Paper elevation={1}>
        <Stack direction='row'>
          <Box padding={2}>
            <SessionHeader session={session} />
            <Stack spacing={1} direction={'row'}>
              <Paper elevation={2}>
                <CharacterSelection session={session} />
              </Paper>
              <Paper elevation={2}>
                {character && session.state.game === 'Aria' && <AriaPage character={character} />}
                {character && session.state.game === 'Rêve de Dragon' && <RddPage character={character} />}
                {!character &&
                  <Stack direction='row' padding={2} spacing={2} sx={{ minWidth: 300 }} alignItems='center'>
                    <Avatar sx={{ bgcolor: 'info.dark' }}>
                      <QuestionMarkIcon />
                    </Avatar>
                    <Typography color='text.disabled'>No character selected.</Typography>
                  </Stack>
                }
              </Paper>
            </Stack>
          </Box>
          <Box padding={2}>
            <RollHistory />
          </Box>
        </Stack>
      </Paper>
    )
  }

  return <p>Session not found..</p>
}