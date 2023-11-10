import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'

import { BasicPopover } from './common/pop-over'
import { CharacterAttributeRoll } from './character-roll'

import { Ability } from '../domain/character/character'

type Props = {
  ability: Ability
}

export const AbilityBlock = ({ ability }: Props) => {
  return (
    <Card>
      <Grid container alignItems='center' padding={1} spacing={6}>
        <Grid item xs>
          <Typography variant='h6'>
            {ability.name}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <Typography variant='h6' color='secondary'>
            {`${ability.value}%`}
          </Typography>
        </Grid>
        <Grid item xs='auto'>
          <BasicPopover triggerContent={<CasinoIcon />} popoverContent={<CharacterAttributeRoll rollStat='Ability' statName={ability.name} />} />
        </Grid>
      </Grid>
  </Card>
  )
}