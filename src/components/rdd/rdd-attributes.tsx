import Stack from '@mui/material/Stack'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CasinoIcon from '@mui/icons-material/Casino'

import { BasicPopover } from '../common/pop-over'
import { RddRoll } from './rdd-roll'

import { Ability, Attribute } from '../../domain/character/characterSheet'

type Props = {
  attributes: Array<Attribute>
  abilities: Array<Ability>
}

export const RddAttributes = ({ attributes, abilities }: Props) => {
  return (
    <Stack padding={2}>
      <Typography variant='h5'>Attributes</Typography>
      <List dense>
        {attributes.sort((aA, aB) => aA.name.localeCompare(aB.name)).map((attribute) =>
          <ListItem key={attribute.name}
            secondaryAction={
              <BasicPopover triggerContent={<CasinoIcon />} popoverContent={<RddRoll attributeName={attribute.name} abilities={abilities} />} />
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
    </Stack>
  )
}