// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import { Card, DataList, Flex, Grid, Separator, Strong, Text } from '@radix-ui/themes';
import { deepEqual } from 'fast-equals';
import type { ReactNode } from 'react';
import { memo, useState } from 'react';


export const Component = ({ id, summary, secondary, details, actions }: Props) => {
    const [open, setOpen] = useState(false);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Chevron = open ? ChevronUpIcon : ChevronDownIcon;

    return (
        <Card>
            <Collapsible.Root
                open={open}
                onOpenChange={setOpen}
            >
                <Flex
                    direction="column"
                    gap="2"
                >
                    <Collapsible.Trigger asChild>
                        <Grid
                            columns="20px 1fr 20px"
                            px="1"
                            gap="4"
                            style={{ cursor: 'pointer' }}
                            align="center"
                        >
                            <Strong>{id}</Strong>
                            <Text
                                wrap="nowrap"
                                style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}
                            >
                                {summary}
                            </Text>
                            <Chevron
                                height={20}
                                width={20}
                            />

                            <Separator
                                size="4"
                                mb="2"
                                style={{ gridColumn: '1 / 4' }}
                            />
                        </Grid>
                    </Collapsible.Trigger>

                    <DataList.Root>
                        {Object.entries(secondary ?? {}).map(([label, value]) => (
                            <DataList.Item key={label}>
                                <DataList.Label>{label}</DataList.Label>
                                <DataList.Value>{value}</DataList.Value>
                            </DataList.Item>
                        ))}
                        {Object.entries(open ? details : {}).map(([label, value]) => (
                            <DataList.Item key={label}>
                                <DataList.Label>{label}</DataList.Label>
                                <DataList.Value>{value}</DataList.Value>
                            </DataList.Item>
                        ))}
                    </DataList.Root>
                    <Collapsible.Content>
                        <Separator
                            size="4"
                            my="2"
                        />

                        {actions}
                    </Collapsible.Content>
                </Flex>
            </Collapsible.Root>
        </Card>
    );
};
Component.displayName = 'ExpandableCard';

export const ExpandableCard = memo(Component, deepEqual);

interface Props {
    id: number | string;
    summary: string;
    secondary?: Record<string, string>;
    details: Record<string, string>;
    actions: ReactNode;
}
