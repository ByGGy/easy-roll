import { useState, useEffect } from 'react'

import { CharacterSelection } from './character-selection'
import { CharacterPage } from './character-page'

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
    return <CharacterPage />
  }

  return <CharacterSelection />
}