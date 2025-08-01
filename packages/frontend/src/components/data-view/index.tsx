import { memo } from 'react';

import type { Props as DataCardsListProps } from './cards';
import { DataCardsList } from './cards';
import type { Props as DataTableProps } from './table';
import { DataTable } from './table';
import { useMediaQuery } from './use-media-query';


const Component = <T extends { id: string | number }>(props: Props<T>) => {
    const isMobile = useMediaQuery('(max-width: 768px)'); // radix-ui sm breakpoint

    return isMobile ? <DataCardsList {...props} /> : <DataTable {...props} />;
};
Component.displayName = 'DataView';

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export const DataView = memo(Component) as typeof Component;

interface Props<T extends { id: string | number }> extends DataCardsListProps<T>, DataTableProps<T> {
    dummy?: string;
}
