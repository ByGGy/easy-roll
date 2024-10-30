import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'

export const CheapRouter = () => {
  const characterSheets = useSelector((state: RootState) => state.characterCollection.characters)
  const characterId = useSelector((state: RootState) => state.session.characterId)
  const character = characterSheets.find(sheet => sheet.id === characterId)

  if (character) {
    // TODO: need a better check
    if (character.game === 'Aria') {
      return <AriaPage character={character} />
    }

    if (character.game === 'Rêve de Dragon') {
      return <RddPage character={character} />
    }

    return <p>Game not supported</p>
  }

  return <CharacterSelection />
}