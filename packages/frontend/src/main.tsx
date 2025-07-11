import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { DataProvider } from './data/provider.tsx';


const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <Theme>
                <DataProvider>
                    <App />
                </DataProvider>
            </Theme>
        </StrictMode>
    );
}
