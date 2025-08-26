import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';

import type { Job, MaybeWithId, WithId } from '../../types';

import { baseQuery } from './_base-query';


const TYPE = 'JOB';
export const jobsApi = createApi({
    reducerPath: 'jobs',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getJobs: builder.query<WithId<Job>[], void>({
            query: () => 'jobs',
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
                        'Zapytanie do API o płatników ZUS się nie powiodło. Odśwież stronę lub uderz do admina',
                        { autoClose: false }
                    );
                }
            }
        }),
        saveJob: builder.mutation<WithId<Job>, MaybeWithId<Job>>({
            query: ({ id, userId, ...body }) => ({
                url: typeof id === 'number'
                    ? `jobs/${id}`
                    : 'jobs',
                method: 'POST',
                body
            }),
            invalidatesTags: result => (result ? [{ type: TYPE, id: 'LIST' }, { type: TYPE, id: result.id }] : []),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: job } = await queryFulfilled;

                    dispatch(
                        jobsApi.util.updateQueryData('getJobs', undefined, draft => {
                            const index = draft.findIndex(l => l.id === job.id);
                            if (index === -1) {
                                draft.push(job);
                            } else {
                                draft[index] = job;
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
    getJobs: {
        useQuery: useGetJobsQuery,
        useQueryState: useGetJobsState
    },
    saveJob: { useMutation: useSaveJobMutation }
} = jobsApi.endpoints;

export const selectJobs = createSelector(
    jobsApi.endpoints.getJobs.select(),
    state => state.data
);
