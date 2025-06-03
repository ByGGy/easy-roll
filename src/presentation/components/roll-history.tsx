import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
// @ts-ignore
import Jdenticon from 'react-jdenticon'
import Divider from '@mui/material/Divider'
import Badge, { BadgeProps } from '@mui/material/Badge'

import { RollResult } from '../../domain/common/types'
import { unreachable } from '../../domain/common/tools'
import { DarkTooltip } from './common/style-helpers'
import { DiceIcon } from './common/dice-icon'

const QualityBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    // right: '-0.5em',
    // top:'0em',
    backgroundColor: `${theme.palette.background.paper}`,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

type RollItemProps = {
  roll: RollResult
  opacity: number
}

const RollItem = ({ roll, opacity }: RollItemProps) => {
  const allCharacters = useSelector((state: RootState) => state.characterCollection.characters)
  const characterName = allCharacters.find(c => c.id === roll.characterId)?.state.name ?? 'Unknown'
  const selectedCharacterId = useSelector((state: RootState) => state.selection.characterId)

  const title = roll.title

  // TODO: duplicated code with /src/domain/discord/relay.handleRollResult function
  const details = []
  roll.diceDetails.groups.forEach(g => {
    details.push(`${g.diceQty}d${g.diceFaceQty} = ${g.rolls.join(', ')}`)  
  })

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
    details.push(`quality: ${roll.outcomeDetails.quality}`)
  }

  return (
    <Stack padding={2} spacing={2} direction='row' sx={{ opacity }} alignItems='flex-start'>
      <Avatar sx={{ bgcolor: roll.characterId === selectedCharacterId ? 'text.primary' : '' }}>
        <Jdenticon value={characterName} />
      </Avatar>
      <Stack sx={{ width: 200 }}>
        <Typography variant='subtitle2' color={roll.characterId === selectedCharacterId ? 'text.primary' : 'text.secondary'}>{characterName}</Typography>
        <Typography variant='body1'>{title}</Typography>
      </Stack>
      <DarkTooltip title={<span style={{ whiteSpace: 'pre-line' }}>{details.join('\n')}</span>} placement='right'>
        <QualityBadge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={
            <Typography variant='caption' fontWeight='bold' color={roll.outcome === 'success' ? 'success.main' : 'error.main'}>
              {roll.outcomeDetails.quality[0].toUpperCase()}
            </Typography>
          }
          invisible={roll.outcomeDetails.quality === 'normal'}
        >
          <Stack
            direction='row'
            padding={0.5}
            spacing={1}
            alignItems='center'
            sx={{
              backgroundColor: roll.outcome === 'value' ? 'info.light' : roll.outcome === 'success' ? 'success.main' : 'error.main',
              color:'background.paper',
              borderRadius: 4
            }}
          >
            <DiceIcon color='inherit' strokeWidth={roll.outcomeDetails.quality === 'normal' ? 1 : 2} />
            <Typography variant='h6' pr={1}
              sx={{
                fontWeight: roll.outcomeDetails.quality === 'normal' ? '' : 'bold',
                color: 'inherit',
              }}>
              {roll.diceDetails.total}
            </Typography>
          </Stack>
        </QualityBadge>
      </DarkTooltip>
    </Stack>
  )
}

export const RollHistory = () => {
  const rolls = useSelector((state: RootState) => state.rollHistory.rolls)

  const maxVisibleQty = rolls.length
  const fadedOutThreshold = 10 //Math.round(maxVisibleQty / 2)
  const fadedOutOpacity = 0.25

  return (
    <Stack padding={2} height='100%' overflow='hidden'>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>{`${maxVisibleQty} Most Recent Rolls`}</Typography>
        </Grid>
      </Grid>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {rolls.slice(0, maxVisibleQty).map((roll, index) =>
          <Box key={index}>
            <RollItem roll={roll} opacity={index > fadedOutThreshold ? fadedOutOpacity : 1 - index * (1 - fadedOutOpacity) / fadedOutThreshold} />
            <Divider variant='inset'/>
          </Box>
        )}
      </Box>
    </Stack>
  )
}