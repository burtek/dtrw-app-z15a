import { render, screen } from '@testing-library/react';
import { Fragment } from 'react/jsx-runtime';

import App from './App';


vitest.mock(import('./data/provider'), _importOriginal => ({
    // eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unsafe-type-assertion
    DataProvider: Fragment as unknown as Awaited<ReturnType<typeof _importOriginal>>['DataProvider'],
    useData: () => ({
        kids: { data: [], update: vitest.fn(), reload: vitest.fn() },
        jobs: { data: [], update: vitest.fn(), reload: vitest.fn() },
        caretakers: { data: [], update: vitest.fn(), reload: vitest.fn() },
        leaves: { data: [], update: vitest.fn(), reload: vitest.fn() }
    })
}));


test('App renders', () => {
    const { container } = render(<App />);

    expect(container).not.toBeEmptyDOMElement();

    const tabs = screen.getAllByRole('tab');

    expect(tabs).toHaveLength(4);

    expect(tabs[0]).toHaveTextContent(/Zwolnienia/);
    expect(tabs[1]).toHaveTextContent(/Opiekunowie\/rodzice/);
    expect(tabs[2]).toHaveTextContent(/Dzieci/);
    expect(tabs[3]).toHaveTextContent(/Płatnicy/);
});
