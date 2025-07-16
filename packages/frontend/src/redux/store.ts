import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { createLogger } from 'redux-logger';

import { caretakersApi } from './apis/caretakers';
import { apiHealthApi } from './apis/health';
import { jobsApi } from './apis/jobs';
import { kidsApi } from './apis/kids';
import { leavesApi } from './apis/leaves';


declare global {
    interface Window {
        forceLog?: boolean;
    }
}

export const store = configureStore({
    devTools: true,
    reducer: combineSlices(leavesApi, caretakersApi, jobsApi, kidsApi, apiHealthApi),
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            leavesApi.middleware,
            caretakersApi.middleware,
            jobsApi.middleware,
            kidsApi.middleware,
            apiHealthApi.middleware,
            createLogger({
                predicate() {
                    return !import.meta.env.PROD || !!window.forceLog;
                }
            })
        )
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
