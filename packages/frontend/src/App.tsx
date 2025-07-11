import { Box, Tabs } from '@radix-ui/themes';

import { useData } from './data/provider';
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

function App() {
    const { kids: { data: kids }, jobs: { data: jobs }, caretakers: { data: caretakers }, leaves: { data: leaves } } = useData();

    return (
        <Tabs.Root defaultValue={Tab.LEAVES}>
            <Tabs.List>
                <Tabs.Trigger value={Tab.LEAVES}>Zwolnienia ({leaves.length})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.CARETAKERS}>Opiekunowie/rodzice ({caretakers.length})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.KIDS}>Dzieci ({kids.length})</Tabs.Trigger>
                <Tabs.Trigger value={Tab.JOBS}>Płatnicy ZUS ({jobs.length})</Tabs.Trigger>
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
        </Tabs.Root>
    );
}
App.displayName = 'App';

export default App;
