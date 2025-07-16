import { createSelector } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './_base-query';


const TYPE = 'API';
export const apiHealthApi = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: [TYPE],
    endpoints: builder => ({
        // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
        getStatus: builder.query<{ status: string; commit: string; version: string; nodeVersion: string }, void>({
            query: () => 'health',
            providesTags: [TYPE]
        })
    })
});

export const { useGetStatusQuery } = apiHealthApi;

export const selectHealth = createSelector(
    apiHealthApi.endpoints.getStatus.select(),
    state => state.data
);
