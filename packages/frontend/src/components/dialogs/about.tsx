import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import type { FC } from 'react';
import { memo, useCallback } from 'react';


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
            <Dialog.Content maxWidth="450px">
                <Dialog.Title>O aplikacji</Dialog.Title>

                <Dialog.Description
                    size="2"
                    mb="4"
                    hidden
                >
                    O aplikacji
                </Dialog.Description>

                <Text
                    as="p"
                    mb="2"
                >
                    Aplikacja służy jako pomoc w wypełnianiu formularza Z-15A.
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    Aplikacja jest udostępniania bezpłatnie, a dane nie opuszczają serwera na którym się znajduje.
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    Aplikacja znajduje się w fazie BETA, proszę o weryfikację wypełnienia formularzy i zgłaszanie błędów.
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
Component.displayName = 'AboutDialog';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const AboutDialog = memo(Component);
