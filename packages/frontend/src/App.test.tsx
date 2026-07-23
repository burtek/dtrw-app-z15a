import { Theme } from '@radix-ui/themes';
import { render, screen, waitFor } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './redux/store';


vitest.mock(import('./components/data-view/use-media-query'), () => ({ useMediaQuery: () => true }));

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

    async function dismissAllDialogs(user: UserEvent) {
        // await Promise.all(screen.getAllByText('OK').map(element => user.click(element)));
        for (const element of screen.getAllByText('OK').reverse()) {
            // eslint-disable-next-line no-await-in-loop
            await user.click(element);
        }
    }

    it('App renders with two dialogs open', async () => {
        const user = userEvent.setup();

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

        await dismissAllDialogs(user);

        const tabs = screen.getAllByRole('tab');

        expect(tabs).toHaveLength(5);

        expect(tabs[0]).toHaveTextContent(/^Zwolnienia/);
        expect(tabs[1]).toHaveTextContent(/^Rodzice/);
        expect(tabs[2]).toHaveTextContent(/^Dzieci/);
        expect(tabs[3]).toHaveTextContent(/^Płatnicy/);
        expect(tabs[4]).toHaveTextContent(/^Urlopy rodzicielskie/);
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
    ])('should open $label dialog', async ({ label, expected }) => {
        const user = userEvent.setup();

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

        await dismissAllDialogs(user);

        expect(screen.queryByText(expected)).not.toBeInTheDocument();

        await user.click(screen.getByText(label));

        expect(screen.getByText(expected)).toBeInTheDocument();
    });
});
