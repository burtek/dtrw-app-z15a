import type { Draft } from 'immer';
import { produce } from 'immer';
import { useState, useCallback, useEffect, useMemo } from 'react';

import type { WithId } from '../types';


export enum ApiEndpoint {
    LEAVES = '/api/leaves',
    KIDS = '/api/kids',
    JOBS = '/api/jobs',
    CARETAKERS = '/api/caretakers'
}

export function useGet<T extends WithId<object>>(endpoint: ApiEndpoint) {
    const [entities, setEntities] = useState<T[]>([]);

    const reload = useCallback(() => {
        const controller = new AbortController();

        async function fetchJobs() {
            try {
                const response = await fetch(endpoint, { signal: controller.signal });
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                const data = await response.json() as T[];
                setEntities(data);
            } catch {
            }
        }
        void fetchJobs();

        return () => {
            controller.abort();
        };
    }, [endpoint]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(reload, []);

    const update = useCallback((entity: T) => {
        setEntities(produce(prev => {
            const oldEntity = prev.find(e => e.id === entity.id);
            if (oldEntity) {
                Object.assign(oldEntity, entity);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                prev.push(entity as Draft<T>);
            }
        }));
    }, []);

    return useMemo(() => ({ data: entities, reload, update }), [entities, reload, update]);
}

const POST_INIT = {
    method: 'POST',
    headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
};

export const usePost = (endpoint: ApiEndpoint) => {
    const [isSaving, setIsSaving] = useState(false);

    const create = async (payload: unknown) => {
        setIsSaving(true);
        const result = await fetch(endpoint, {
            ...POST_INIT,
            body: JSON.stringify(payload)
        });
        setIsSaving(false);
        return result;
    };

    const update = async (id: number | string, payload: unknown) => {
        setIsSaving(true);
        const result = await fetch(`${endpoint}/${id}`, {
            ...POST_INIT,
            body: JSON.stringify(payload)
        });
        setIsSaving(false);
        return result;
    };

    return { create, update, isSaving };
};
