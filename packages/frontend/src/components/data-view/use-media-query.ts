import { useState, useEffect } from 'react';


const mqls: Record<string, MediaQueryList> = {};

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(window.matchMedia(query).matches);

    useEffect(() => {
        const mql = mqls[query] ?? (mqls[query] = window.matchMedia(query));
        const listener = () => {
            setMatches(mql.matches);
        };

        mql.addEventListener('change', listener);
        return () => {
            mql.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
};
