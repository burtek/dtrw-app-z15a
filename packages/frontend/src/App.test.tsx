import { Theme } from '@radix-ui/themes';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './redux/store';


const handlers = [
    http.get('/api/leaves', async () => {
        await delay(150);
        return HttpResponse.json([]);
    }),
    http.get('/api/kids', async () => {
        await delay(150);
        return HttpResponse.json([]);
    }),
    http.get('/api/caretakers', async () => {
        await delay(150);
        return HttpResponse.json([]);
    }),
    http.get('/api/jobs', async () => {
        await delay(150);
        return HttpResponse.json([]);
    })
];

const server = setupServer(...handlers);

beforeAll(() => {
    server.listen();
});

afterEach(() => {
    server.resetHandlers();
});

test('App renders', () => {
    const { container } = render(<App />, {
        wrapper({ children }) {
            return (
                <Theme>
                    <Provider store={store}>
                        {children}
                    </Provider>
                </Theme>
            );
        }
    });

    expect(container).not.toBeEmptyDOMElement();

    const tabs = screen.getAllByRole('tab');

    expect(tabs).toHaveLength(4);

    expect(tabs[0]).toHaveTextContent(/Zwolnienia/);
    expect(tabs[1]).toHaveTextContent(/Opiekunowie\/rodzice/);
    expect(tabs[2]).toHaveTextContent(/Dzieci/);
    expect(tabs[3]).toHaveTextContent(/Płatnicy/);
});
