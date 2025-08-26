import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import type { Kid, MaybeWithId, WithId } from '../../types';

import { baseQuery } from './_base-query';


const TYPE = 'KID';
export const kidsApi = createApi({
    reducerPath: 'kids',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getKids: builder.query<WithId<Kid>[], void>({
            query: () => 'kids',
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
                        'Zapytanie do API o dzieci się nie powiodło. Odśwież stronę lub uderz do admina',
                        { autoClose: false }
                    );
                }
            }
        }),
        saveKid: builder.mutation<WithId<Kid>, MaybeWithId<Kid>>({
            query: ({ id, userId, ...body }) => ({
                url: typeof id === 'number'
                    ? `kids/${id}`
                    : 'kids',
                method: 'POST',
                body
            }),
            invalidatesTags: result => (result ? [{ type: TYPE, id: 'LIST' }, { type: TYPE, id: result.id }] : []),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: kid } = await queryFulfilled;

                    dispatch(
                        kidsApi.util.updateQueryData('getKids', undefined, draft => {
                            const index = draft.findIndex(l => l.id === kid.id);
                            if (index === -1) {
                                draft.push(kid);
                            } else {
                                draft[index] = kid;
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
    getKids: {
        useQuery: useGetKidsQuery,
        useQueryState: useGetKidsState
    },
    saveKid: { useMutation: useSaveKidMutation }
} = kidsApi.endpoints;

export const selectKids = createSelector(
    kidsApi.endpoints.getKids.select(),
    state => state.data
);
