import { Theme } from '@radix-ui/themes';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './redux/store';


describe('App.tsx', () => {
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

    it('App renders with two dialogs open', async () => {
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

        await waitFor(() => {
            expect(screen.queryAllByRole('dialog', { hidden: true })).toHaveLength(2);
        });

        expect(screen.queryAllByRole('tab')).toHaveLength(0);

        screen.getAllByText('OK').forEach(element => fireEvent.click(element));

        const tabs = screen.getAllByRole('tab');

        expect(tabs).toHaveLength(4);

        expect(tabs[0]).toHaveTextContent(/^Zwolnienia/);
        expect(tabs[1]).toHaveTextContent(/^Rodzice/);
        expect(tabs[2]).toHaveTextContent(/^Dzieci/);
        expect(tabs[3]).toHaveTextContent(/^Płatnicy/);
    });

    it.each([
        {
            label: 'O aplikacji',
            expected: /Aplikacja służy jako pomoc w wypełnianiu formularza Z-15A\./
        },
        {
            label: 'Ostrzeżenie',
            expected: /Użytkownik jest odpowiedzialny za sprawdzenie poprawności danych w formularzu przed jego złożeniem\./
        },
        {
            label: 'Polityka prywatności',
            expected: /Ta aplikacja przechowuje tylko dane niezbędne do wygenerowania formularzy ZUS Z-15A/
        }
    ])('should open $label dialog', ({ label, expected }) => {
        render(<App />, {
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

        screen.getAllByText('OK').forEach(element => fireEvent.click(element));

        expect(screen.queryByText(expected)).not.toBeInTheDocument();

        fireEvent.click(screen.getByText(label));

        expect(screen.getByText(expected)).toBeInTheDocument();
    });
});
