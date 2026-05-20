import * as React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Avatar from '@mui/material/Avatar'
// @ts-ignore
import Jdenticon from 'react-jdenticon'
import Badge, { BadgeProps } from '@mui/material/Badge'

import { RollResult } from '../../domain/common/types'
import { unreachable } from '../../domain/common/tools'
import { CustomPopover } from './common/pop-over'
import { DarkTooltip } from './common/style-helpers'
import { DiceIcon } from './common/dice-icon'
import { PaintSplash } from './common/paint-splash'
import { AriaRoll } from './aria/aria-roll'
import { RddRoll } from './rdd/rdd-roll'
import { BasicRoll } from './basic/basic-roll'
import { DeadlandsRoll } from './deadlands/deadlands-roll'


const QualityBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: '-0.5em',
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
  const characterName = allCharacters.find(c => c.id === roll.request.characterId)?.state.name ?? 'Unknown'
  const selectedCharacterId = useSelector((state: RootState) => state.selection.characterId)

  const title = roll.title

  // TODO: duplicated code with /src/domain/discord/relay.handleRollResult function
  const details = []
  roll.diceDetails.groups.forEach(g => {
    details.push(`${g.diceQty}${g.symbol}${g.diceFaceQty} = ${g.rolls.join(', ')}`)  
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

  const getIntensity = () => {
    switch (roll.outcomeDetails.quality) {
      case 'normal': return 0
      case 'significant': return 0.3
      case 'particular': return 0.65
      case 'critical': return 1
    }
  }

  // TODO: use tiniColor2 module to create the palette with different modes, e.g. complementary, shades, monochromatic
  // TODO: use styled() to get the theme as props in order to derive the palette from theme' colors ?
  // e.g. before it was something like (theme) => outcome === 'value' ? theme.palette.info.light : outcome === 'success' ? theme.palette.success.main : theme.palette.error.main,
  // vertical vs horizontal stroke in the paintsplash for failures vs success ?
  const getPalette = () => {
    switch (roll.outcome) {
      case 'value': return ['#00A4B8', '#B86F02', '#B83000']
      case 'success': return ['#44B053', /*'#c78039',*/ '#6645B0'] // ['#88BA34', '#BA34A0', '#7134BB']
      case 'failure': return ['#B81B00', '#522821', '#852A1B']
    }
  }

  return (
    <Stack padding={1} spacing={1} direction='row' sx={{ opacity }} alignItems='flex-center'>
      <Stack sx={{ width: 200 }}>
        <Typography variant='body1'>{title}</Typography>
        <Stack spacing={1} direction='row' alignItems='center'>
          <Avatar sx={{ width: '1rem', height: '1rem', bgcolor: roll.request.characterId === selectedCharacterId ? 'text.primary' : '' }}>
            <Jdenticon value={characterName} />
          </Avatar>
          <Typography variant='subtitle2' color={roll.request.characterId === selectedCharacterId ? 'text.primary' : 'text.secondary'}>{characterName}</Typography>
        </Stack>
      </Stack>
      <PaintSplash sx={{ width: 80 }} seed={roll.id} intensity={getIntensity()} palette={getPalette()}>
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
          <DarkTooltip title={<span style={{ whiteSpace: 'pre-line' }}>{details.join('\n')}</span>} placement='right'>
            <Typography
              variant='h6'
              sx={{
                fontWeight: roll.outcomeDetails.quality === 'normal' ? '' : 'bold',
                color: 'black',
                textShadow: '2px 2px 4px rgba(0,0,0,0.65)',
              }}>
              {roll.diceDetails.total}
            </Typography>
          </DarkTooltip>
        </QualityBadge>
      </PaintSplash>
    </Stack>
  )
}

type ReRollProps = {
  roll: RollResult
}

const ReRoll = ({ roll }: ReRollProps) => {
  switch (roll.request.kind) {
    case 'ariaCheckAttribute':
      return <AriaRoll
        characterId={roll.request.characterId}
        rollStat='Attribute'
        statName={roll.request.attributeName}
        initDifficulty={roll.request.difficulty}
        initModifier={roll.request.modifier}
      />

    case 'ariaCheckAbility':
      return <AriaRoll
        characterId={roll.request.characterId}
        rollStat='Ability'
        statName={roll.request.abilityName}
        initModifier={roll.request.modifier}
      />

    case 'rddCheckAttribute':
      return <RddRoll
        characterId={roll.request.characterId}
        attributeName={roll.request.attributeName}
        initAbilityName={roll.request.abilityName}
        initModifier={roll.request.modifier}
      />

    case 'basicCheckAttribute':
      return <BasicRoll
        characterId={roll.request.characterId}
        rollStat='Attribute'
        statName={roll.request.attributeName}
        initModifier={roll.request.modifier}
      />

    case 'basicCheckAbility':
      return <BasicRoll
        characterId={roll.request.characterId}
        rollStat='Ability'
        statName={roll.request.abilityName}
        initDifficulty={roll.request.difficulty}
        initModifier={roll.request.modifier}
      />

    case 'deadlandsCheckAttribute':
      return <DeadlandsRoll
        characterId={roll.request.characterId}
        rollStat='Attribute'
        statName={roll.request.attributeName}
        initDifficulty={roll.request.difficulty}
        initModifier={roll.request.modifier}
      />

    case 'deadlandsCheckAbility':
      return <DeadlandsRoll
        characterId={roll.request.characterId}
        rollStat='Ability'
        statName={roll.request.abilityName}
        initDifficulty={roll.request.difficulty}
        initModifier={roll.request.modifier}
      />

    case 'diceAction':
    case 'diceTray':
      window.electronAPI.checkCharacter(roll.request)
      return null

    default:
      return unreachable(roll.request)
  }
}

type MaybeWrapForReRollProps = {
  roll: RollResult
  item: React.ReactElement
}

const MaybeWrapForReRoll = ({ roll, item }: MaybeWrapForReRollProps) => {
  switch (roll.request.kind) {
    case 'ariaCheckAttribute':
    case 'ariaCheckAbility':
    case 'rddCheckAttribute':
    case 'basicCheckAttribute':
    case 'basicCheckAbility':
    case 'deadlandsCheckAttribute':
    case 'deadlandsCheckAbility':
      return (
        <CustomPopover
          triggerComponent={item}
          popoverContent={
            <ReRoll roll={roll} />
          }
        />
      )

    case 'diceAction':
    case 'diceTray': {
      const handleClick = () => window.electronAPI.checkCharacter(roll.request)
      return React.cloneElement(item, { onClick: handleClick })
    }

    default:
      return unreachable(roll.request)
  }
}

export const RollHistory = () => {
  const rolls = useSelector((state: RootState) => state.rollHistory.rolls)

  const maxVisibleQty = rolls.length
  const fadedOutThreshold = 10
  const fadedOutOpacity = 0.25

  return (
    <Stack padding={2} height='100%' overflow='hidden'>
      <Grid container alignItems='center'>
        <Grid item xs>
          <Typography variant='h6' color='primary'>{`${maxVisibleQty} Most Recent Rolls`}</Typography>
        </Grid>
      </Grid>
      <List dense sx={{ flex: 1, overflow: 'auto' }}>
        {rolls.slice(0, maxVisibleQty).map((roll, index) =>
          <ListItem
            key={roll.id}
            disablePadding
            sx={{
              '& .dice-action': {
                opacity: 0.25,
                color: (theme) => theme.palette.text.secondary,
                transition: 'all 0.2s',
              },
              '&:hover .dice-action': {
                opacity: 1,
                color: (theme) => theme.palette.primary.main,
              },
            }}>
            <MaybeWrapForReRoll
              roll={roll}
              item={
                <ListItemButton sx={{ width: '100%' }}>
                  <Grid container alignItems='center' columnSpacing={1} wrap="nowrap">
                    <Grid item xs='auto'>
                      <DiceIcon className='dice-action' fontSize='large' color='primary' sx={{ display: 'block' }} />
                    </Grid>
                    <Grid item xs>
                      <RollItem roll={roll} opacity={index > fadedOutThreshold ? fadedOutOpacity : 1 - index * (1 - fadedOutOpacity) / fadedOutThreshold} />
                    </Grid>
                  </Grid>
                </ListItemButton>
              }
            />
          </ListItem>          
        )}
      </List>
    </Stack>
  )
}