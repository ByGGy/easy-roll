import { ThemeProvider, ThemeOptions, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createRoot } from 'react-dom/client'
import { store } from './store/store'
import { Provider } from 'react-redux'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'

import { VersionInfo } from './components/version-info'
import { CheapRouter } from './components/cheap-router'

const primaryColor = '#b95a34'
const secondaryColor = '#3493b9'
const backgroundColor = '#0e100b'

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
    background: {
      default: backgroundColor,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            borderRadius: '10px',
            backgroundClip: 'content-box',
            border: '1px solid transparent'
          },
        },
      },
    },
  },
}

const theme = createTheme(themeOptions)

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Paper elevation={1} sx={{ flex: '1', overflow:'auto', padding: 2 }}>
            <CheapRouter />
          </Paper>
          <VersionInfo />
        </Box>
      </ThemeProvider>
    </Provider>
  )
}

const container = document.getElementById('App')
if (container === null) {
  throw new Error('App Container not found')
}

const root = createRoot(container)

root.render(
  <App />
)