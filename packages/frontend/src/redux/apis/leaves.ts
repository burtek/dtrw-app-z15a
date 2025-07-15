import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';

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
                    : [{ type: TYPE, id: 'LIST' }])
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
                } catch {
                    // optional: handle rollback or toast error
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
    saveLeave: { useMutation: useSaveLeaveMutation }
} = leavesApi.endpoints;

export const selectLeaves = createSelector(
    leavesApi.endpoints.getLeaves.select(),
    state => state.data
);
