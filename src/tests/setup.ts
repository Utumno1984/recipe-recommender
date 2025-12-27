import '@testing-library/jest-dom';

// Mock ResizeObserver for @tanstack/react-virtual
class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
}

window.ResizeObserver = ResizeObserver;
