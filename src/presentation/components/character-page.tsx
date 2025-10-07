import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { CharacterHeader } from './character-header'
import { DiceTray } from './dice-tray'

import { AriaAttributes } from './aria/aria-attributes'
import { AriaAbilities } from './aria/aria-abilities'

import { RddAbilities } from './rdd/rdd-abilities'
import { RddAttributes } from './rdd/rdd-attributes'

import { BasicAttributes } from './basic/basic-attributes'
import { BasicAbilities } from './basic/basic-abilities'

import { unreachable } from '../../domain/common/tools'
import { CharacterData } from '../../domain/character/character'
import { Game } from '../../domain/common/types'

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}

type Props = {
  game: Game
  character: CharacterData
}

const AttributesPanel = ({ game, character }: Props) => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return <AriaAttributes character={character} />
    case 'Rêve de Dragon': return <RddAttributes character={character} />
    case 'BaSIC': return <BasicAttributes character={character} />
  }
}

const AbilitiesPanel = ({ game, character }: Props) => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return <AriaAbilities character={character} />
    case 'Rêve de Dragon': return <RddAbilities character={character} />
    case 'BaSIC': return <BasicAbilities character={character} />
  }
}

export const CharacterPage = ({ game, character }: Props) => {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Stack spacing={1} padding={2} height='100%' overflow='hidden'>
      <CharacterHeader character={character} />
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
      >
        <Tab label='Attributes' />
        <Tab label='Abilities' />
        <Tab label='Dice Tray' />
      </Tabs>
      <Paper elevation={4} sx={{ height: "100%", overflow:'hidden', minWidth: 400 }}>
        <Stack height='100%' overflow='hidden'>
          <TabPanel value={currentTab} index={0}>
            <AttributesPanel game={game} character={character} />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <AbilitiesPanel game={game} character={character} />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <DiceTray character={character} />
          </TabPanel>
        </Stack>
      </Paper>
    </Stack>
  )
}
