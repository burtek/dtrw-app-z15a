import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import type { FC } from 'react';
import { memo, useCallback } from 'react';


const disable = (event: { preventDefault: () => void }) => {
    event.preventDefault();
};

const Component: FC<Props> = ({ open, onClose }) => {
    const handleClose = useCallback((state: boolean) => {
        if (!state) {
            onClose();
        }
    }, [onClose]);

    return (
        <Dialog.Root
            open={open}
            onOpenChange={handleClose}
        >
            <Dialog.Content
                maxWidth="450px"
                onEscapeKeyDown={disable}
                onPointerDownOutside={disable}
                onInteractOutside={disable}
                onFocusOutside={disable}
            >
                <Dialog.Title>Uwaga!</Dialog.Title>

                <Dialog.Description
                    size="2"
                    mb="4"
                >
                    Ta aplikacja znajduje się w fazie BETA
                </Dialog.Description>

                <Text
                    as="p"
                    mb="2"
                >
                    Wygenerowane formularze mogą zawierać błędy.
                    <br />
                    Użytkownik jest odpowiedzialny za sprawdzenie poprawności danych w formularzu przed jego złożeniem.
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    Autor aplikacji nie ponosi odpowiedzialności za konsekwencje i szkody wynikające ze złożenia nieprawidłowo wypełnionego wniosku.
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    Aplikacja ani jej autor nie są powiązani z Zakładem Ubezpieczeń Społecznych.
                </Text>

                <Flex
                    mt="4"
                    justify="end"
                >
                    <Dialog.Close>
                        <Button>OK</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};
Component.displayName = 'DisclaimerDialog';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const DisclaimerDialog = memo(Component);
