import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createRoot } from 'react-dom/client'
import { CharacterSheet } from './components/character-sheet'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#002b47',
      paper: '#004877',
    },
    primary: {
      main: '#7ab9ea',
    },
    secondary: {
      main: '#FFD740',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#242424',
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
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