import { Theme } from '@radix-ui/themes';
import { QueryStatus } from '@reduxjs/toolkit/query';
import { act, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Provider } from 'react-redux';

import { useGetStatusQuery } from '../redux/apis/health';
import { store } from '../redux/store';

import { HealthStatus } from './healthCheck';


vitest.mock(import('../redux/apis/health'), async original => ({
    ...await original(),
    useGetStatusQuery: vitest.fn()
}));
vitest.mock('../../package.json', () => ({ default: { version: '1.2.3' } }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fn = () => useGetStatusQuery();
type HookReturnSlice = Pick<ReturnType<typeof fn>, 'status' | 'data'>;

describe('components/healthCheck', () => {
    it.each([
        {
            status: QueryStatus.fulfilled,
            data: {
                status: 'ok',
                version: '1.2.3',
                commit: 'abc1234',
                nodeVersion: '22.0.0'
            },
            expectedText: /^Status API: ok. Wersja: 1.2.3$/,
            expectedColor: 'green'
        },
        {
            status: QueryStatus.fulfilled,
            data: {
                status: 'nieok',
                version: '1.2.3',
                commit: 'abc1234',
                nodeVersion: '22.0.0'
            },
            expectedText: /^Status API: nieok. Wersja: 1.2.3$/,
            expectedColor: 'red'
        },
        {
            status: QueryStatus.fulfilled,
            data: undefined,
            expectedText: /^Status API: nieznany. Wersja: 1.2.3$/,
            expectedColor: 'orange'
        },
        {
            status: QueryStatus.rejected,
            data: undefined,
            expectedText: /^Status API: brak połączenia. Wersja: 1.2.3$/,
            expectedColor: 'red'
        },
        {
            status: QueryStatus.fulfilled,
            data: {
                status: 'ok',
                version: '1.2.2',
                commit: 'abc1234',
                nodeVersion: '22.0.0'
            },
            expectedText: /^Status API: ok. Wersja: 1.2.3. Odśwież aby zaktualizować$/,
            expectedColor: 'orange'
        },
        {
            status: QueryStatus.fulfilled,
            data: {
                status: 'ok',
                version: '1.2.4',
                commit: 'abc1234',
                nodeVersion: '22.0.0'
            },
            expectedText: /^Status API: ok. Wersja: 1.2.3. Odśwież aby zaktualizować$/,
            expectedColor: 'orange'
        }
    ])('should update to $expectedColor status with correct text', ({ status, data, expectedColor, expectedText }) => {
        let updateState: (data: HookReturnSlice) => void;

        vitest.mocked(useGetStatusQuery).mockImplementation(() => {
            const [state, setState] = useState<HookReturnSlice>({
                status: QueryStatus.uninitialized,
                data: undefined
            });
            updateState = setState;

            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            return state as ReturnType<typeof fn>;
        });

        const { container } = render(
            <HealthStatus />,
            {
                wrapper({ children }) {
                    return (
                        <Theme>
                            <Provider store={store}>
                                {children}
                            </Provider>
                        </Theme>
                    );
                }
            }
        );

        expect(container).toHaveTextContent(/^Status API: nieznany. Wersja: 1.2.3$/);
        expect(screen.getByText(/Status API:\s+nieznany/)).toHaveAttribute('data-accent-color', 'orange');

        act(() => {
            updateState({ status, data });
        });

        expect(container).toHaveTextContent(expectedText);
        expect(screen.getByText(expectedText)).toHaveAttribute('data-accent-color', expectedColor);

        // should keep it when refreshing
        act(() => {
            updateState({
                status: QueryStatus.pending,
                data
            });
        });

        expect(container).toHaveTextContent(expectedText);
        expect(screen.getByText(expectedText)).toHaveAttribute('data-accent-color', expectedColor);
    });
});
