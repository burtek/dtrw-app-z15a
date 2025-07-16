import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import type { Leave, MaybeWithId, WithId } from '../../types';

import { baseQuery } from './_base-query';


const TYPE = 'LEAVE';
export const leavesApi = createApi({
    reducerPath: 'leaves',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getLeaves: builder.query<WithId<Leave>[], void>({
            query: () => 'leaves',
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
                        'Zapytanie do API o zwolnienia się nie powiodło. Odśwież stronę lub uderz do admina',
                        { autoClose: false }
                    );
                }
            }
        }),
        saveLeave: builder.mutation<WithId<Leave>, MaybeWithId<Leave>>({
            query: ({ id, ...body }) => ({
                url: typeof id === 'number'
                    ? `leaves/${id}`
                    : 'leaves',
                method: 'POST',
                body
            }),
            invalidatesTags: result => (result ? [{ type: TYPE, id: 'LIST' }, { type: TYPE, id: result.id }] : []),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: leave } = await queryFulfilled;

                    dispatch(
                        leavesApi.util.updateQueryData('getLeaves', undefined, draft => {
                            const index = draft.findIndex(l => l.id === leave.id);
                            if (index === -1) {
                                draft.push(leave);
                            } else {
                                draft[index] = leave;
                            }
                        })
                    );

                    toast.success('Dane zapisane');
                } catch {
                    toast.error('Zapisanie danych się nie powiodło, zweryfikuj poprawność danych lub uderz do admina');
                }
            },
            extraOptions: { maxRetries: 0 }
        }),
        sendByEmail: builder.mutation<{
            status: string;
            emailResult: {
                accepted: string[];
                rejected: string[];
                response: string;
                messageId: string;
            };
        }, number>({
            query: id => ({
                url: `pdf/${id}/mail`,
                method: 'GET'
            }),
            extraOptions: { maxRetries: 0 },
            onQueryStarted: async (_arg, { queryFulfilled }) => {
                const toastId = toast.info(
                    'Zlecam wysyłkę maila...',
                    { autoClose: false }
                );
                try {
                    const { data: { emailResult: { accepted, rejected } } } = await queryFulfilled;
                    if (rejected.length === 0) {
                        toast.update(
                            toastId,
                            {
                                render() {
                                    return 'Mail został wysłany';
                                },
                                type: 'success',
                                autoClose: 5000
                            }
                        );
                    } else {
                        toast.update(
                            toastId,
                            {
                                render() {
                                    return `Wysyłka maila została zlecona. Sukces: ${accepted.length} odbiorców, błąd: ${rejected.length} odbiorców.`;
                                },
                                type: 'warning',
                                autoClose: 5000
                            }
                        );
                    }
                } catch {
                    toast.update(
                        toastId,
                        {
                            render() {
                                return 'Zlecenie wysyłki maila nie powiodło się. Odśwież stronę lub uderz do admina';
                            },
                            type: 'error',
                            autoClose: false
                        }
                    );
                }
            }
        })
    })
});

export const {
    getLeaves: {
        useQuery: useGetLeavesQuery,
        useQueryState: useGetLeavesState
    },
    saveLeave: { useMutation: useSaveLeaveMutation },
    sendByEmail: { useMutation: useSendEmail }
} = leavesApi.endpoints;

export const selectLeaves = createSelector(
    leavesApi.endpoints.getLeaves.select(),
    state => state.data
);
