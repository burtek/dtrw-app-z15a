/* eslint-disable @typescript-eslint/member-ordering */
import '@testing-library/jest-dom/vitest';


// Mock the ResizeObserver
const ResizeObserverMock = vitest.fn(class ResizeObserverMockImpl {
    // eslint-disable-next-line @typescript-eslint/parameter-properties
    private readonly callback: ResizeObserverCallback;

    // eslint-disable-next-line promise/prefer-await-to-callbacks
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }

    observe = vitest.fn(_target => {
        this.callback([], this);
    });

    unobserve = vitest.fn();

    disconnect = vitest.fn();
});

// Stub the global ResizeObserver
vitest.stubGlobal('ResizeObserver', ResizeObserverMock);
