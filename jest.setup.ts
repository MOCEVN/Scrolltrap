import '@testing-library/jest-dom';

if (!globalThis.IntersectionObserver) {
  class IntersectionObserverMock implements IntersectionObserver {
    readonly root = null;

    readonly rootMargin = '0px';

    readonly thresholds = [] as number[];

    disconnect(): void { }

    observe(): void { }

    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }

    unobserve(): void { }
  }

  globalThis.IntersectionObserver =
    IntersectionObserverMock as unknown as typeof IntersectionObserver;
}
