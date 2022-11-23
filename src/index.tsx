import { render } from 'solid-js/web'

/* @refresh reload */
import { createTheme, ThemeProvider } from '@suid/material'

// import './index.css';
import App from './App'
import { Router } from '@solidjs/router'

const theme = createTheme({
  palette: {
    primary: {
      main: '#008080',
    },
  },
});

render(() => <ThemeProvider theme={theme}>
  <Router>
    <App />
  </Router>
</ThemeProvider>, document.getElementById('root') as HTMLElement);
