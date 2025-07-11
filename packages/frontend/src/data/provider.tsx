import type { PropsWithChildren } from 'react';
import { createContext, useContext, useMemo } from 'react';

import type { Caretaker, Job, Kid, Leave, WithId } from '../types';

import { ApiEndpoint, useGet } from './apiHooks';


const noop = () => null;
const makeEmptySlice = <T extends object>(): Slice<T> => ({
    data: [],
    update: noop,
    reload: noop
});
const DataContext = createContext<Data>({
    caretakers: makeEmptySlice(),
    kids: makeEmptySlice(),
    jobs: makeEmptySlice(),
    leaves: makeEmptySlice()
});
DataContext.displayName = 'DataContext';

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: PropsWithChildren) => {
    const jobs = useGet<WithId<Job>>(ApiEndpoint.JOBS);
    const kids = useGet<WithId<Kid>>(ApiEndpoint.KIDS);
    const leaves = useGet<WithId<Leave>>(ApiEndpoint.LEAVES);
    const caretakers = useGet<WithId<Caretaker>>(ApiEndpoint.CARETAKERS);

    return (
        <DataContext.Provider value={useMemo(() => ({ jobs, kids, leaves, caretakers }), [jobs, kids, leaves, caretakers])}>
            {children}
        </DataContext.Provider>
    );
};
DataProvider.displayName = 'DataProvider';

interface Slice<T> {
    data: ReadonlyArray<WithId<T>>;
    update: (data: WithId<T>) => void;
    reload: () => void;
}

interface Data {
    caretakers: Slice<Caretaker>;
    kids: Slice<Kid>;
    jobs: Slice<Job>;
    leaves: Slice<Leave>;
}
