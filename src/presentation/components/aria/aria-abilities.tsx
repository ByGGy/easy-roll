import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'

import { BasicPopover } from '../common/pop-over'
import { AriaRoll } from './aria-roll'

import { Ability } from '../../domain/character/characterSheet'

type Props = {
  abilities: Readonly<Array<Ability>>
}

export const AriaAbilities = ({ abilities }: Props) => {
  const sortedAbilities = abilities.toSorted((aA, aB) => aA.name.localeCompare(aB.name))

  return (
    <Stack padding={2}>
      <Typography variant='h6' color='primary'>Abilities</Typography>
      <List dense>
        {sortedAbilities.map((ability) =>
          <ListItem key={ability.name}
            secondaryAction={
              <BasicPopover triggerContent={<CasinoIcon />} popoverContent={<AriaRoll rollStat='Ability' statName={ability.name} />} />
            }
          >
          <Grid container alignItems='center' spacing={4}>
            <Grid item xs>
              <Typography variant='body1' color='text.secondary'>{ability.name}</Typography>
            </Grid>
            <Grid item xs='auto' paddingRight={2}>
              <Typography variant='body1'>{`${ability.value}%`}</Typography>
            </Grid>
          </Grid>
          </ListItem>
        )}
      </List>
    </Stack>
  )
}