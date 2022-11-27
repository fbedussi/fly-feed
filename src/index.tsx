import { render } from 'solid-js/web'

import { createTheme, ThemeProvider } from '@suid/material'

import App from './App'
import { Router } from '@solidjs/router'
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';

const theme = createTheme({
  palette: {
    primary: {
      main: '#008080',
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

render(() => (
  <ThemeProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </ThemeProvider>
), document.getElementById('root') as HTMLElement);
