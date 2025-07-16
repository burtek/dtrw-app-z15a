import { Badge, Text, Tooltip } from '@radix-ui/themes';
import { QueryStatus } from '@reduxjs/toolkit/query';
import type { ComponentProps } from 'react';
import { useMemo, useRef } from 'react';

import packageJson from '../../package.json';
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
        if (lastStatus === QueryStatus.fulfilled && data?.status === 'ok' && data.version === packageJson.version) {
            return 'green';
        }
        return 'orange';
    }, [data, lastStatus]);

    const renderTooltipContent = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const uiSha = import.meta.env.VITE_COMMIT as string | undefined;
        return (
            <>
                <Text
                    size="1"
                    as="div"
                >
                    Wersja API: {data?.version ?? '-'}/{data?.commit.substring(0, 7) ?? '-'}
                </Text>
                <Text
                    size="1"
                    as="div"
                >
                    Wersja UI: {packageJson.version}/{uiSha?.substring(0, 7)}
                </Text>
            </>
        );
    };

    return (
        <Tooltip content={renderTooltipContent()}>
            <Badge
                color={color}
                mt="1"
                mr="2"
                size="2"
            >
                Status API: {lastStatus === QueryStatus.rejected ? 'brak połączenia' : data?.status ?? 'nieznany'}
                {'. '}
                Wersja: {packageJson.version}
                {data && (packageJson.version !== data.version) ? '. Odśwież aby zaktualizować' : null}
            </Badge>
        </Tooltip>
    );
};
HealthStatus.displayName = 'HealthStatus';
