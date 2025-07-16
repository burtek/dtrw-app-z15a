import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import App from './App.tsx';
import { store } from './redux/store.ts';


const root = document.getElementById('root');

if (root) {
    createRoot(root).render(
        <StrictMode>
            <Theme>
                <Provider store={store}>
                    <App />
                </Provider>
            </Theme>
            <ToastContainer style={{ marginTop: 32 }} />
        </StrictMode>
    );
}
