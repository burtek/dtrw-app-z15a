import { Box, Button, DropdownMenu, Flex, Tabs } from '@radix-ui/themes';
import type { FC } from 'react';
import { useCallback, useState } from 'react';

import styles from './App.module.css';
import { AboutDialog } from './components/dialogs/about';
import { DisclaimerDialog } from './components/dialogs/disclaimer';
import { GDPRDialog } from './components/dialogs/gdpr';
import { HealthStatus } from './components/healthCheck';
import { useGetCaretakersQuery } from './redux/apis/caretakers';
import { useGetJobsQuery } from './redux/apis/jobs';
import { useGetKidsQuery } from './redux/apis/kids';
import { useGetLeavesQuery } from './redux/apis/leaves';
import { CaretakersTable } from './tabs/caretakers/table';
import { JobsTable } from './tabs/jobs/table';
import { KidsTable } from './tabs/kids/table';
import { LeavesTable } from './tabs/leaves/table';


const enum Tab {
    LEAVES = 'leaves',
    KIDS = 'kids',
    JOBS = 'jobs',
    CARETAKERS = 'caretakers'
}

function useDialogState(initial: boolean = false) {
    const [open, setOpen] = useState(initial);

    const openDialog = useCallback(() => {
        setOpen(true);
    }, []);
    const closeDialog = useCallback(() => {
        setOpen(false);
    }, []);

    return { open, openDialog, closeDialog };
}

const DIALOGS: Array<{
    name: string;
    component: FC<{ open: boolean; onClose: () => void }>;
    defaultOpen: boolean;
}> = [
    {
        name: 'O aplikacji',
        component: AboutDialog,
        defaultOpen: false
    },
    {
        name: 'Polityka prywatności',
        component: GDPRDialog,
        defaultOpen: true
    },
    {
        name: 'Ostrzeżenie',
        component: DisclaimerDialog,
        defaultOpen: true
    }
];

function App() {
    const { data: kids } = useGetKidsQuery();
    const { data: jobs } = useGetJobsQuery();
    const { data: caretakers } = useGetCaretakersQuery();
    const { data: leaves } = useGetLeavesQuery();

    // eslint-disable-next-line react-hooks/rules-of-hooks -- safe as DIALOGS is constant
    const dialogsControls = DIALOGS.map(dialog => useDialogState(dialog.defaultOpen));

    return (
        <Tabs.Root defaultValue={Tab.LEAVES}>
            <Tabs.List wrap="wrap">
                <Tabs.Trigger value={Tab.LEAVES}>Zwolnienia ({leaves?.length ?? <span className={styles.spinner} />})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.CARETAKERS}>Rodzice ({caretakers?.length ?? <span className={styles.spinner} />})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.KIDS}>Dzieci ({kids?.length ?? <span className={styles.spinner} />})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.JOBS}>Płatnicy ZUS ({jobs?.length ?? <span className={styles.spinner} />})</Tabs.Trigger>
                <Flex
                    style={{ flex: 1 }}
                    direction="row"
                    justify="end"
                    align="baseline"
                    gap="4"
                >
                    <Flex
                        direction="row"
                        align="baseline"
                        gap="4"
                        display={{ initial: 'none', lg: 'flex' }}
                    >
                        {DIALOGS.map((dialog, index) => {
                            const handleOpen = dialogsControls[index].openDialog;
                            return (
                                <Button
                                    variant="ghost"
                                    onClick={handleOpen}
                                    key={dialog.name}
                                >
                                    {dialog.name}
                                </Button>
                            );
                        })}
                    </Flex>
                    <Flex
                        direction="row"
                        align="baseline"
                        gap="4"
                        display={{ initial: 'flex', lg: 'none' }}
                    >
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <Button variant="ghost">
                                    Informacje
                                    <DropdownMenu.TriggerIcon />
                                </Button>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                {DIALOGS.map((dialog, index) => {
                                    const handleOpen = dialogsControls[index].openDialog;
                                    return (
                                        <DropdownMenu.Item
                                            onSelect={handleOpen}
                                            key={dialog.name}
                                        >
                                            {dialog.name}
                                        </DropdownMenu.Item>
                                    );
                                })}
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                    <HealthStatus />
                </Flex>
            </Tabs.List>
            <Box pt="3">
                <Tabs.Content value={Tab.LEAVES}>
                    <LeavesTable />
                </Tabs.Content>

                <Tabs.Content value={Tab.CARETAKERS}>
                    <CaretakersTable />
                </Tabs.Content>

                <Tabs.Content value={Tab.KIDS}>
                    <KidsTable />
                </Tabs.Content>

                <Tabs.Content value={Tab.JOBS}>
                    <JobsTable />
                </Tabs.Content>
            </Box>

            {DIALOGS.map((dialog, index) => {
                const handleClose = dialogsControls[index].closeDialog;
                return (
                    <dialog.component
                        key={dialog.name}
                        open={dialogsControls[index].open}
                        onClose={handleClose}
                    />
                );
            })}
        </Tabs.Root>
    );
}
App.displayName = 'App';

export default App;
