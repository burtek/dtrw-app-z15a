import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import type { Caretaker, MaybeWithId, WithId } from '../../types';

import { baseQuery } from './_base-query';


const TYPE = 'CARETAKER';
export const caretakersApi = createApi({
    reducerPath: 'caretakers',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getCaretakers: builder.query<WithId<Caretaker>[], void>({
            query: () => 'caretakers',
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
                        'Zapytanie do API o opiekunów się nie powiodło. Odśwież stronę lub uderz do admina',
                        { autoClose: false }
                    );
                }
            }
        }),
        saveCaretaker: builder.mutation<WithId<Caretaker>, MaybeWithId<Caretaker>>({
            query: ({ id, ...body }) => ({
                url: typeof id === 'number'
                    ? `caretakers/${id}`
                    : 'caretakers',
                method: 'POST',
                body
            }),
            invalidatesTags: result => (result ? [{ type: TYPE, id: 'LIST' }, { type: TYPE, id: result.id }] : []),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: caretaker } = await queryFulfilled;

                    dispatch(
                        caretakersApi.util.updateQueryData('getCaretakers', undefined, draft => {
                            const index = draft.findIndex(l => l.id === caretaker.id);
                            if (index === -1) {
                                draft.push(caretaker);
                            } else {
                                draft[index] = caretaker;
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
    getCaretakers: {
        useQuery: useGetCaretakersQuery,
        useQueryState: useGetCaretakersState
    },
    saveCaretaker: { useMutation: useSaveCaretakerMutation }
} = caretakersApi.endpoints;

export const selectCaretakers = createSelector(
    caretakersApi.endpoints.getCaretakers.select(),
    state => state.data
);
