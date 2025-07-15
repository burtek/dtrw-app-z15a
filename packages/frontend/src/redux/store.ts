import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import { caretakersApi } from './apis/caretakers';
import { jobsApi } from './apis/jobs';
import { kidsApi } from './apis/kids';
import { leavesApi } from './apis/leaves';


export const store = configureStore({
    devTools: true,
    reducer: combineSlices(leavesApi, caretakersApi, jobsApi, kidsApi),
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(leavesApi.middleware, caretakersApi.middleware, jobsApi.middleware, kidsApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
