import { get } from 'lodash'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { CardContent, useTheme, alpha } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Switch from '@mui/material/Switch'
import Stack from '@mui/material/Stack'
import Fab from '@mui/material/Fab'
import Typography from '@mui/material/Typography'
import MoreVertIcon from '@mui/icons-material/MoreVert'

import { IconPopover } from './common/pop-over'
import { PrimaryToggleButton } from './common/style-helpers'
import { DiscordIcon } from './common/discord-icon'
import { EditValue } from './common/edit-value'

import { NotificationLevel } from '../../domain/common/types'
import { CharacterData } from '../../domain/character/character'
import { unreachable } from '../../domain/common/tools'

type DiscordEditProps = {
  character: CharacterData
}

const DiscordEdit = ({ character }: DiscordEditProps) => {
  const { enable, level, channelId } = character.state.discordNotification
  
  const handleEnableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.electronAPI.changeCharacterDiscordNotification(character.id, event.target.checked, level, channelId)
  };

  const handleLevelChange = (
    event: React.MouseEvent<HTMLElement>,
    value: NotificationLevel | null,
  ) => {
    if (value !== null) {
      window.electronAPI.changeCharacterDiscordNotification(character.id, enable, value, channelId)
    }
  }

  const handleChannelIdChange = (newChannelId: string) => {
    window.electronAPI.changeCharacterDiscordNotification(character.id, enable, level, newChannelId)
  }

  return (
    <Card>
      <Box padding={2} sx={{ minWidth: 300 }}>
        <CardContent>
          <Stack gap={2}>
            <FormGroup>
              <FormControlLabel control={<Switch checked={enable} onChange={handleEnableChange} />} label="Enable notifications" />
            </FormGroup>
            <Box>
              <Stack direction='row' spacing={2} sx={{ mb: 1 }} alignItems='baseline'>
                <Typography color='text.secondary'>Notification level</Typography>
                <Typography variant='body2'>{level}</Typography>
              </Stack>
              <ToggleButtonGroup
                value={level}
                exclusive
                onChange={handleLevelChange}
                size='small'
              >
                <PrimaryToggleButton value='Strict'>Strict</PrimaryToggleButton>
                <PrimaryToggleButton value='Standard'>Standard</PrimaryToggleButton>
                <PrimaryToggleButton value='Verbose'>Verbose</PrimaryToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Box>
              <Typography color='text.secondary'>Channel ID</Typography>
              <EditValue initialValue={channelId} onApply={handleChannelIdChange} />
            </Box>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}

type Props = {
  character: CharacterData
}

export const DiscordConfiguration = ({ character }: Props) => {
  const isEnabled = character.state.discordNotification.enable

  const getTallyColorPath = () => {
    if (isEnabled) {
      switch (character.state.discordNotification.level) {
        default: return unreachable(character.state.discordNotification.level)
        case 'Strict': return 'warning.main'
        case 'Standard': return 'success.main'
        case 'Verbose': return 'error.main'
      }
    }

    return 'text.disabled'
  }

  const theme = useTheme()
  const tallyColor = get(theme.palette, getTallyColorPath())

  const handleToggleChange = () => {
    window.electronAPI.toggleCharacterDiscordNotification(character.id)
  }

  return (
    <Stack direction='row' sx={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 20 }}>
      <Fab variant='extended' size='medium' onClick={handleToggleChange}
          sx={{
            backgroundColor: 'background.default'
          }}
      >
        <DiscordIcon sx={{ mr: 1 }}/>
        <Typography variant='button'
          sx={{
            fontWeight: isEnabled ? 'bold' : '',
            color: tallyColor,
            textShadow: isEnabled ? `0 0 10px ${alpha(tallyColor, 0.9)}` : '',  // Glow effect
          }}
          >
          ON AIR
        </Typography>
      </Fab>
      <IconPopover triggerContent={<MoreVertIcon color='secondary' fontSize='small' />} popoverContent={<DiscordEdit character={character} />} />
    </Stack>
  )
}