import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import App from './pages/App';
import theme from './lib/theme';
import { AgentProvider } from './auth/AgentContext';
import { registerServiceWorker } from './lib/serviceWorkerRegistration';
import { CustomerProvider } from './customers/CustomerContext';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AgentProvider>
          <CustomerProvider>
            <App />
          </CustomerProvider>
        </AgentProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
