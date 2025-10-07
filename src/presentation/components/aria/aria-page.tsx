import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { CharacterHeader } from '../character-header'
import { AriaAttributes } from './aria-attributes'
import { AriaAbilities } from './aria-abilities'
import { DiceTray } from '../dice-tray'

import { CharacterData } from '../../../domain/character/character'

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
  character: CharacterData
}

//TODO: make a generic CharacterPage (they all have the same layout)
export const AriaPage = ({ character }: Props) => {
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
            <AriaAttributes character={character} />
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <AriaAbilities character={character} />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <DiceTray character={character} />
          </TabPanel>
        </Stack>
      </Paper>
    </Stack>
  )
}
