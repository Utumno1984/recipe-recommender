import '@testing-library/jest-dom/vitest';

// Mock ResizeObserver for @tanstack/react-virtual
class ResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe(target: Element) {
        this.callback([{
            target,
            contentRect: {
                bottom: 0,
                height: 1000,
                left: 0,
                right: 0,
                top: 0,
                width: 1000,
                x: 0,
                y: 0,
                toJSON: () => { }
            },
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: []
        }], this);
    }
    unobserve() { }
    disconnect() { }
}

window.ResizeObserver = ResizeObserver;
