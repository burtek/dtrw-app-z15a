import { Badge, Tooltip } from '@radix-ui/themes';
import { QueryStatus } from '@reduxjs/toolkit/query';
import type { ComponentProps } from 'react';
import { useMemo, useRef } from 'react';

import { useGetStatusQuery } from '../redux/apis/health';


const useLastStatus = (status: QueryStatus) => {
    const current = useRef<QueryStatus>(status);

    if ([QueryStatus.rejected, QueryStatus.fulfilled].includes(status)) {
        current.current = status;
    }

    return current.current;
};

export const HealthStatus = () => {
    const { status, data } = useGetStatusQuery(undefined, { pollingInterval: 5000 });

    const lastStatus = useLastStatus(status);

    const color = useMemo<NonNullable<ComponentProps<typeof Badge>['color']>>(() => {
        if (lastStatus === QueryStatus.rejected || (data && data.status !== 'ok')) {
            return 'red';
        }
        if (lastStatus === QueryStatus.fulfilled && data?.status === 'ok') {
            return 'green';
        }
        return 'orange';
    }, [data, lastStatus]);

    return (
        <>
            <div style={{ flex: 1 }} />
            <Tooltip content={data ? `Wersja ${data.version}, commit ${data.commit.substring(0, 7)}` : ''}>
                <Badge
                    color={color}
                    mt="1"
                    mr="2"
                    size="2"
                >
                    Status API: {lastStatus === QueryStatus.rejected ? 'brak połączenia' : data?.status ?? 'nieznany'}
                    {data?.version ? ` | Wersja: ${data.version}` : null}
                </Badge>
            </Tooltip>
        </>
    );
};
HealthStatus.displayName = 'HealthStatus';
