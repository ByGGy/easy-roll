import { createCharacter, Character, Entity, EntityId } from "./character"

export type Repository<T extends Entity> = {
  getAll: () => Readonly<Array<T>>
  getById: (id: EntityId) => T | undefined
}

export const createRepository = (): Repository<Character> => {
  const characters = [createCharacter()]

  const getAll = () => characters
  const getById = (id: EntityId) => characters.find((c) => c.id === id)

  return {
    getAll,
    getById,
  }
}