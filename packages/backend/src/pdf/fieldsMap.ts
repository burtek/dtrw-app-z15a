export const Z15A_FIELDS_MAP = {
    fillee: {
        pesel: 'topmostSubform[0].Page1[0].PESEL[0]',
        name: 'topmostSubform[0].Page1[0].Imię[0]',
        surname: 'topmostSubform[0].Page1[0].Nazwisko[0]',
        street: 'topmostSubform[0].Page1[0].Ulica[0]',
        streetNo: 'topmostSubform[0].Page1[0].Numerdomu[0]',
        flatNo: 'topmostSubform[0].Page1[0].Numerlokalu[0]',
        zipCode: 'topmostSubform[0].Page1[0].Kodpocztowy[0]',
        city: 'topmostSubform[0].Page1[0].Miejscowość[0]'
    },
    employer: {
        nip: 'topmostSubform[0].Page2[0].NIP[0]',
        name: 'topmostSubform[0].Page2[0].Nazwapłatnika[0]'
    },
    bankDetails: { accountNumber: 'topmostSubform[0].Page2[0].Numerrachunku[0]' },
    leaveData: { text: 'topmostSubform[0].Page2[0].Tekst1a[0]' },
    kid: {
        pesel: 'topmostSubform[0].Page2[0].PESEL[0]',
        name: 'topmostSubform[0].Page2[0].Imię[0]',
        surname: 'topmostSubform[0].Page2[0].Nazwisko[0]',
        disabled: {
            yes: 'topmostSubform[0].Page2[0].OrzeczenieTAK[0]',
            no: 'topmostSubform[0].Page2[0].OrzeczenieNIE[0]'
        }
    },
    attestations: {
        otherPersonAvailable: {
            yes: 'topmostSubform[0].Page2[0].Oświadczenie1TAK[0]',
            no: 'topmostSubform[0].Page2[0].Oświadczenie1NIE[0]',
            details: 'topmostSubform[0].Page2[0].Tekst1[0]'
        },
        shiftWork: {
            yes: 'topmostSubform[0].Page2[0].Oświadczenie2TAK[0]',
            no: 'topmostSubform[0].Page2[0].Oświadczenie2NIE[0]',
            details: 'topmostSubform[0].Page2[0].Tekst2[0]'
        },
        kidOver14InSameHousehold: {
            yes: 'topmostSubform[0].Page3[0].Oświadczenie3TAK[0]',
            no: 'topmostSubform[0].Page3[0].Oświadczenie3NIE[0]'
        },
        changedEmployerAndTookLeave: {
            yes: 'topmostSubform[0].Page3[0].Oświadczenie4TAK[0]',
            no: 'topmostSubform[0].Page3[0].Oświadczenie4NIE[0]',
            noChange: 'topmostSubform[0].Page3[0].Oświadczenie4NIEZMIENILEM[0]',
            kidTo8Or14Check: 'topmostSubform[0].Page3[0].ZaznaczX4a[0]',
            kidTo8Or14Days: 'topmostSubform[0].Page3[0].Liczbadni3a[0]',
            kidSickOver14Check: 'topmostSubform[0].Page3[0].ZaznaczX4b[0]',
            kidSickOver14Days: 'topmostSubform[0].Page3[0].Liczbadni3b[0]',
            kidSickOrDisabledCheck: 'topmostSubform[0].Page3[0].ZaznaczX4c[0]',
            kidSickOrDisabledDays: 'topmostSubform[0].Page3[0].Liczbadni3c[0]'
        }
    },
    otherParent: {
        pesel: 'topmostSubform[0].Page3[0].PESEL[0]',
        name: 'topmostSubform[0].Page3[0].Imię[0]',
        surname: 'topmostSubform[0].Page3[0].Nazwisko[0]'
    },
    otherParentAttestations: {
        works: {
            yes: 'topmostSubform[0].Page3[0].Dane1TAK[0]',
            no: 'topmostSubform[0].Page3[0].Dane1NIE[0]',
            shiftYes: 'topmostSubform[0].Page3[0].Dane1BTAK[0]',
            shiftNo: 'topmostSubform[0].Page3[0].Dane1BNIE[0]',
            details: 'topmostSubform[0].Page3[0].Tekst2[0]'
        },
        tookLeave: {
            yes: 'topmostSubform[0].Page3[0].Dane2TAK[0]',
            no: 'topmostSubform[0].Page3[0].Dane2NIE[0]',
            kidTo8Or14Check: 'topmostSubform[0].Page3[0].ZaznaczX2a[0]',
            kidTo8Or14Days: 'topmostSubform[0].Page3[0].Liczbadni2a[0]',
            kidSickOver14Check: 'topmostSubform[0].Page3[0].ZaznaczX2b[0]',
            kidSickOver14Days: 'topmostSubform[0].Page3[0].Liczbadni2b[0]',
            kidSickOrDisabledCheck: 'topmostSubform[0].Page3[0].ZaznaczX2c[0]',
            kidSickOrDisabledDays: 'topmostSubform[0].Page3[0].Liczbadni2c[0]'
        }
    },
    footer: {
        notes: 'topmostSubform[0].Page5[0].Tekst1[0]',
        date: 'topmostSubform[0].Page5[0].Data[0]'
    }
} satisfies Record<string, Record<string, string | Record<string, string>>>;
