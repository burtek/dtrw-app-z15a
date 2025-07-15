import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders(headers) {
        const { hash } = window.location;
        if (import.meta.env.DEV && hash) {
            const params = new URLSearchParams(hash.replace(/^#/, '?'));
            if (params.has('user')) {
                headers.set('Remote-User', params.get('user') ?? '');
                headers.set('Remote-Groups', 'z15a');
            }
        }
        return headers;
    }
});
