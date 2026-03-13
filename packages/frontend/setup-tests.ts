/* eslint-disable @typescript-eslint/member-ordering */
import '@testing-library/jest-dom/vitest';


// Mock the ResizeObserver
const ResizeObserverMock = vitest.fn(class ResizeObserverMockImpl {
    constructor(private readonly callback: ResizeObserverCallback) {
    }

    observe = vitest.fn(_target => {
        this.callback([], this);
    });

    unobserve = vitest.fn();

    disconnect = vitest.fn();
});

// Stub the global ResizeObserver
vitest.stubGlobal('ResizeObserver', ResizeObserverMock);
