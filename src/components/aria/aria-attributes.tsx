import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'

import { BasicPopover } from '../common/pop-over'
import { AriaRoll } from './aria-roll'

import { Attribute } from '../../domain/character/characterSheet'

type Props = {
  attributes: Array<Attribute>
}

export const AriaAttributes = ({ attributes }: Props) => {
  return (
    <List dense>
      {attributes.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((attribute) =>
        <ListItem key={attribute.name}
          secondaryAction={
            <BasicPopover triggerContent={<CasinoIcon />} popoverContent={<AriaRoll rollStat='Attribute' statName={attribute.name} />} />
          }
        >
        <Grid container alignItems='center' spacing={4}>
          <Grid item xs>
            <Typography variant='body1' color='primary'>
              {attribute.name}
            </Typography>
          </Grid>
          <Grid item xs='auto' paddingRight={2}>
            <Typography variant='body1' >
              {attribute.value}
            </Typography>
          </Grid>
        </Grid>
        </ListItem>
      )}
    </List>
  )
}