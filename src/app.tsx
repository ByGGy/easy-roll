import { ThemeProvider, ThemeOptions, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createRoot } from 'react-dom/client'
import { store } from './store/store'
import { Provider } from 'react-redux'

import { CheapRouter } from './components/cheap-router'

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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CheapRouter />
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