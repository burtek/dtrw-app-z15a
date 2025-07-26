import { Button, Dialog, Flex, Text } from '@radix-ui/themes';
import type { FC } from 'react';
import { memo, useCallback } from 'react';


const disable = (event: { preventDefault: () => void }) => {
    event.preventDefault();
};

export const GDPR_VERSION = 1;
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
                maxWidth="700px"
                onEscapeKeyDown={disable}
                onPointerDownOutside={disable}
                onInteractOutside={disable}
                onFocusOutside={disable}
            >
                <Dialog.Title>Polityka prywatności</Dialog.Title>

                <Dialog.Description
                    size="2"
                    mb="4"
                    hidden
                >
                    Polityka prywatności
                </Dialog.Description>

                <Text
                    as="div"
                    size="5"
                    mb="2"
                >
                    Prywatność i cookies
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    {`
                    Ta aplikacja przechowuje tylko dane niezbędne do wygenerowania formularzy ZUS Z-15A — w tym dane dzieci,
                    opiekunów, pracodawców oraz ewentualny adres e-mail, który może być używany do automatycznego wysyłania formularzy PDF.
                    Dane te są widoczne tylko po zalogowaniu i nie są przekazywane osobom trzecim.
                `}
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    {`
                    Aplikacja nie korzysta z żadnych zewnętrznych usług (takich jak Google, Facebook, reklamy, analityka itp.).
                    Wszystkie operacje i przetwarzanie danych odbywają się lokalnie na serwerze, do którego dostęp ma tylko zalogowany użytkownik.
                `}
                </Text>

                <Text
                    as="p"
                    mb="2"
                    weight="medium"
                >
                    {`
                    Masz prawo do dostępu do swoich danych, ich poprawienia lub usunięcia — w każdej chwili.
                    W razie potrzeby skontaktuj się z administratorem aplikacji.
                `}
                </Text>

                <Text
                    as="div"
                    size="5"
                    mb="2"
                >
                    Cookies
                </Text>

                <Text
                    as="p"
                    mb="2"
                >
                    {`
                    Aplikacja używa wyłącznie technicznych cookies (tzw. first-party cookies) do obsługi sesji logowania.
                    Nie są używane żadne inne ciasteczka, ani żadne mechanizmy śledzące.
                `}
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
Component.displayName = 'GDPRDialog';

interface Props {
    open: boolean;
    onClose: () => void;
}

export const GDPRDialog = memo(Component);
