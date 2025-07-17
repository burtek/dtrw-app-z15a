import { render, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';

import { withErrorBoundary } from './withErrorBoundary';


const Child = withErrorBoundary(() => <div>Child</div>);
const ErrorChild = withErrorBoundary(() => {
    throw new Error();
});
const Parent = ({ children }: PropsWithChildren) => (
    <div>
        Parent
        {children}
    </div>
);

describe('components/withErrorBoundary', () => {
    it('should render correctly', () => {
        render(
            <Parent>
                <Child />
            </Parent>
        );

        expect(screen.getByText('Child')).toBeInTheDocument();
        expect(screen.getByText('Parent')).toBeInTheDocument();
        expect(screen.queryByText('An error occured')).not.toBeInTheDocument();
    });

    it('should catch error', () => {
        render(
            <Parent>
                <ErrorChild />
            </Parent>
        );

        expect(screen.getByText('Parent')).toBeInTheDocument();
        expect(screen.getByText('An error occured')).toBeInTheDocument();
    });
});
