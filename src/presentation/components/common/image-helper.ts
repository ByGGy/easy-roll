import { Game } from '../../../domain/common/types'
import { unreachable } from '../../../domain/common/tools'

export const findGameImagePath = (game: Game): string => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return './images/Aria_Cover.jpg'
    case 'Rêve de Dragon': return './images/Reve-de-Dragon_Cover.jpg'
    case 'BaSIC': return './images/BaSIC_Cover.jpg'
  }
}