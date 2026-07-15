import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import type { MaybeWithId, ParentalLeave, WithId } from '../../types';

import { baseQuery } from './_base-query';


const TYPE = 'PARENTAL_LEAVE';
export const parentalLeavesApi = createApi({
    reducerPath: 'parentalLeaves',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getParentalLeaves: builder.query<WithId<ParentalLeave>[], void>({
            query: () => 'parental-leaves',
            providesTags: result =>
                (result
                    ? [
                        ...result.map(({ id }) => ({ type: TYPE, id } as const)),
                        { type: TYPE, id: 'LIST' }
                    ]
                    : [{ type: TYPE, id: 'LIST' }]),
            onQueryStarted: async (_arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                } catch {
                    toast.error(
                        'Zapytanie do API o urlopy rodzicielskie się nie powiodło. Odśwież stronę lub uderz do admina',
                        { autoClose: false }
                    );
                }
            }
        }),
        saveParentalLeave: builder.mutation<WithId<ParentalLeave>, MaybeWithId<ParentalLeave>>({
            query: ({ id, userId, ...body }) => ({
                url: typeof id === 'number'
                    ? `parental-leaves/${id}`
                    : 'parental-leaves',
                method: 'POST',
                body
            }),
            invalidatesTags: result => (result ? [{ type: TYPE, id: 'LIST' }, { type: TYPE, id: result.id }] : []),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: parentalLeave } = await queryFulfilled;

                    dispatch(
                        parentalLeavesApi.util.updateQueryData('getParentalLeaves', undefined, draft => {
                            const index = draft.findIndex(l => l.id === parentalLeave.id);
                            if (index === -1) {
                                draft.push(parentalLeave);
                            } else {
                                draft[index] = parentalLeave;
                            }
                        })
                    );

                    toast.success('Dane zapisane');
                } catch {
                    toast.error('Zapisanie danych się nie powiodło, zweryfikuj poprawność danych lub uderz do admina');
                }
            },
            extraOptions: { maxRetries: 0 }
        })
    })
});

export const {
    getParentalLeaves: {
        useQuery: useGetParentalLeavesQuery,
        useQueryState: useGetParentalLeavesState
    },
    saveParentalLeave: { useMutation: useSaveParentalLeaveMutation }
} = parentalLeavesApi.endpoints;

export const selectParentalLeaves = createSelector(
    parentalLeavesApi.endpoints.getParentalLeaves.select(),
    state => state.data
);
