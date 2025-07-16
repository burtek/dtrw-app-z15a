import { Badge, Tooltip } from '@radix-ui/themes';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';

import { useGetStatusQuery } from '../redux/apis/health';


export const HealthStatus = () => {
    const { data, isLoading, isError, isFetching } = useGetStatusQuery(undefined, { pollingInterval: 5000 });

    const isPostErrorRefetch = (!data && isFetching && !isLoading) as boolean;

    const color = useMemo<NonNullable<ComponentProps<typeof Badge>['color']>>(() => {
        if (isError || (data && data.status !== 'ok') || isPostErrorRefetch) {
            return 'red';
        }
        if (data?.status === 'ok') {
            return 'green';
        }
        return 'orange';
    }, [data, isError, isPostErrorRefetch]);

    return (
        <>
            <div style={{ flex: 1 }} />
            <Tooltip content={data ? `${data.version}, commit ${data.commit.substring(0, 7)}` : ''}>
                <Badge
                    color={color}
                    mt="1"
                    mr="2"
                    size="2"
                >
                    Status API: {isError || isPostErrorRefetch ? 'brak połączenia' : data?.status ?? 'nieznany'}
                </Badge>
            </Tooltip>
        </>
    );
};
HealthStatus.displayName = 'HealthStatus';
