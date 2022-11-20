import { render } from 'solid-js/web'

/* @refresh reload */
import { createTheme, ThemeProvider } from '@suid/material'

// import './index.css';
import App from './App'

const theme = createTheme({
  palette: {
    primary: {
      main: '#008080',
    },
  },
});

render(() => <ThemeProvider theme={theme}>
  <App />
</ThemeProvider>, document.getElementById('root') as HTMLElement);
