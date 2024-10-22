import { useState, useEffect } from 'react'

import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'

import { CharacterSheet } from '../domain/character/characterSheet'

export const CheapRouter = () => {
  const [character, setCharacter] = useState<CharacterSheet | null>(null)

  useEffect(() => {
    window.electronAPI.onMessage('Domain.Session.update', (data: string) => {
      const states = JSON.parse(data)
      setCharacter(states.current.character)
    })
  }, [])

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