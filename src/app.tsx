import { ThemeProvider, ThemeOptions, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createRoot } from 'react-dom/client'
import { CharacterSheet } from './components/character-sheet'


export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#b95a34',
    },
    secondary: {
      main: '#3493b9',
    },
    background: {
      default: '#0e100b',
    },
  },
}

const theme = createTheme(themeOptions)

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CharacterSheet />
    </ThemeProvider>
  )
}

const container = document.getElementById('App')
if (container === null) {
  throw new Error('App Container not found')
}

const root = createRoot(container)

root.render(
  <>
    <App />
  </>
)