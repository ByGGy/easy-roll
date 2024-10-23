import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'

export const CheapRouter = () => {
  const character = useSelector((state: RootState) => state.session.character)

  if (character !== null) {
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