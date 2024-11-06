import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'

export const CheapRouter = () => {
  const characters = useSelector((state: RootState) => state.characterCollection.characters)
  const characterId = useSelector((state: RootState) => state.session.characterId)
  const character = characters.find(c => c.id === characterId)

  if (character) {
    // TODO: need a better check
    if (character.state.game === 'Aria') {
      return <AriaPage character={character} />
    }

    if (character.state.game === 'Rêve de Dragon') {
      return <RddPage character={character} />
    }

    return <p>Game not supported</p>
  }

  return <CharacterSelection />
}