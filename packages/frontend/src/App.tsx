import { Box, Strong, Tabs, Text } from '@radix-ui/themes';

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

const TinySpinner = () => (
    <span style={{
        display: 'inline-block',
        width: 12,
        height: 12,
        border: '2px solid rgba(0,0,0,0.2)',
        borderTopColor: 'rgba(0,0,0,0.6)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        verticalAlign: 'middle'
    }}
    />
);
TinySpinner.displayName = 'TinySpinner';

function App() {
    const { data: kids } = useGetKidsQuery();
    const { data: jobs } = useGetJobsQuery();
    const { data: caretakers } = useGetCaretakersQuery();
    const { data: leaves } = useGetLeavesQuery();

    return (
        <>
            <Text
                color="red"
                as="div"
                size="1"
            >
                <Strong>Disclaimer</Strong>
                aplikacja znajduje się w fazie BETA. Wygenerowane formularze mogą zawierać błędy.
                {' '}
                Użytkownik jest odpowiedzialny za sprawdzenie poprawności danych w formularzu przed jego złożeniem.
            </Text>
            <Text
                color="red"
                as="div"
                size="1"
            >
                Autor aplikacji nie ponosi odpowiedzialności za szkody ani straty wynikające ze złożenia nieprawidłowo wypełnionego wniosku.
                {' '}
                Aplikacja ani jej autor nie są powiązani z Zakładem Ubezpieczeń Społecznych.
            </Text>
            <Tabs.Root defaultValue={Tab.LEAVES}>
                <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}
                </style>
                <Tabs.List>
                    <Tabs.Trigger value={Tab.LEAVES}>Zwolnienia ({leaves?.length ?? <TinySpinner />})</Tabs.Trigger>
                    <Tabs.Trigger value={Tab.CARETAKERS}>Opiekunowie/rodzice ({caretakers?.length ?? <TinySpinner />})</Tabs.Trigger>
                    <Tabs.Trigger value={Tab.KIDS}>Dzieci ({kids?.length ?? <TinySpinner />})</Tabs.Trigger>
                    <Tabs.Trigger value={Tab.JOBS}>Płatnicy ZUS ({jobs?.length ?? <TinySpinner />})</Tabs.Trigger>
                    <HealthStatus />
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
        </>
    );
}
App.displayName = 'App';

export default App;
