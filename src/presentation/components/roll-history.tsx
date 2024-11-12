import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import PersonIcon from '@mui/icons-material/Person'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'

import { RollResult } from '../../domain/common/types'
import { unreachable } from '../../domain/common/tools'
import { DarkTooltip } from './common/style-helpers'

type RollItemProps = {
  roll: RollResult
  opacity: number
}

const RollItem = ({ roll, opacity }: RollItemProps) => {
  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const characterName = allCharacters.find(c => c.id === roll.characterId)?.state.name ?? 'Unknown'
  const selectedCharacterId = useSelector((state: RootState) => state.selection.characterId)

  // TODO: should also display the character name at some point
  let title
  if (roll.checkDetails !== null) {
    title = roll.checkDetails.factors.filter(f => f.type === 'base').map(f => f.name).join(' + ')
  } else {
    title = `${roll.diceDetails.diceQty}d${roll.diceDetails.diceFaceQty}${roll.diceDetails.modifier !== 0 ? `${roll.diceDetails.modifier > 0 ? '+' :''}${roll.diceDetails.modifier}` : ''}`
  }

  const isSuccess = roll.checkDetails !== null ? roll.diceDetails.total <= roll.checkDetails.successThreshold : null

  // TODO: duplicated code with /src/domain/discord/relay.handleRollResult function
  const details = []
  details.push(`${roll.diceDetails.diceQty}d${roll.diceDetails.diceFaceQty} = ${roll.diceDetails.rolls.join(', ')}`)
  if (roll.diceDetails.modifier !== 0) {
    details.push(`modifier: ${roll.diceDetails.modifier > 0 ? '+' :''}${roll.diceDetails.modifier}`)
  }
  if (roll.checkDetails !== null) {
    roll.checkDetails.factors.forEach(f => {
      switch (f.type) {
        default:
          unreachable(f.type)
          break

        case 'base':
          details.push(`${f.name}: ${f.value}`)
          break

        case 'multiplier':
          details.push(`${f.name}: x${f.value}`)
          break

        case 'offset':
          details.push(`${f.name}: ${f.value > 0 ? '+' :''}${f.value}`)
          break
      }
    })

    details.push(`threshold: ${roll.checkDetails.successThreshold}`)
  }

  return (
    <ListItem sx={{ opacity }} alignItems='flex-start'>
      <ListItemAvatar>
        <DarkTooltip title={characterName} placement='left'>
          <Badge badgeContent={roll.diceDetails.total} color={isSuccess !== null ? isSuccess ? 'success' : 'error' : 'info' }>
            <Avatar sx={{ bgcolor: roll.characterId === selectedCharacterId ? 'text.primary' : '' }}>
              <PersonIcon />
            </Avatar>
          </Badge>
        </DarkTooltip>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant='body1'>{title}</Typography>}
        secondary={
          <Typography variant='caption' color='text.secondary' >
            {details.join(' | ')}
          </Typography>
        }>
      </ListItemText>
    </ListItem>
  )
}

export const RollHistory = () => {
  // TODO: display more than 10 rolls, with a proper scrollbar
  const maxVisibleQty = 10
  const fadedOutThreshold = Math.round(maxVisibleQty / 2)
  const fadedOutOpacity = 0.25

  const rolls = useSelector((state: RootState) => state.rollHistory.rolls)

  return (
    <Stack padding={2} sx={{ display: 'flex', flexDirection: 'column'}}>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>{`${maxVisibleQty} Most Recent Rolls`}</Typography>
        </Grid>
      </Grid>
      <List dense sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {rolls.slice(0, maxVisibleQty).map((roll, index) =>
          <Box key={index}>
            <RollItem roll={roll} opacity={index > fadedOutThreshold ? fadedOutOpacity : 1 - index * (1 - fadedOutOpacity) / fadedOutThreshold} />
            <Divider variant='inset' component='li' />
          </Box>
        )}
      </List>
    </Stack>
  )
}