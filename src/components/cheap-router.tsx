import { useState, useEffect } from 'react'

import { CharacterSelection } from './character-selection'
import { AriaPage } from './aria/aria-page'
import { RddPage } from './rdd/rdd-page'

import { CharacterSheet } from '../domain/character/characterSheet'

export const CheapRouter = () => {
  const [character, setCharacter] = useState<CharacterSheet | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await window.electronAPI.getCurrentCharacter()
      const character = JSON.parse(data)
      setCharacter(character)
    }

    fetchData()

    window.electronAPI.onMessage('domain-update', () => {
      fetchData()
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