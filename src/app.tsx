import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createRoot } from 'react-dom/client'
import { DiscordTest } from './components/discordTest'

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
      <DiscordTest />
    </ThemeProvider>
  )
}

const container = document.getElementById('App')
const root = createRoot(container);
root.render(
  <>
    <App />
  </>
)