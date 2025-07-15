import { fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';


export const baseQuery = retry(
    fetchBaseQuery({
        baseUrl: '/api',
        prepareHeaders(headers) {
            const { hash } = window.location;
            if (import.meta.env.DEV && hash) {
                const params = new URLSearchParams(hash.replace(/^#/, '?'));
                if (params.has('user')) {
                    headers.set('Remote-User', params.get('user') ?? '');
                }
            }
            return headers;
        }
    }),
    { maxRetries: 3 }
);
