import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

import { SessionSelection } from './session-selection'
import { SessionPage } from './session-page'

export const CheapRouter = () => {
  const sessionId = useSelector((state: RootState) => state.selection.sessionId)

  if (sessionId !== null) {
    return <SessionPage />
  }

  return <SessionSelection />
}