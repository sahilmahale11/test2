import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext.tsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import ErrorBoundary from './screens/onboarding/ErrorBoundary.tsx';
const theme = createTheme({
    palette: {
        primary: {
            main: '#007BFF',
        },
        secondary: {
            main: '#DC3545',
        },
    },
    // Other theme properties and customizations
});
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <DataProvider>
                    <BrowserRouter>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <App />
                        </ThemeProvider>
                    </BrowserRouter>
                </DataProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    </React.StrictMode>,
);
