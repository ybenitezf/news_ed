/**
 * Represents a BackendRunner, in charge of maintaining the
 * flask backend
 */
export interface BackendRunner {
    /**
     * Runs a backend service at the specified path.
     * @param path - The path where the backend is located.
     * @returns A promise that resolves when the backend has started running.
     */
    run_backend(path: string): Promise<void>;

    /**
     * Tests a backend service by accessing it via the provided URL.
     * @param url - The URL of the backend to test.
     * @param tries - Optional number of attempts to make before giving up, defaults to 10.
     * @returns A promise that resolves with true if the backend is accessible, false otherwise.
     */
    test_backend(url: string, tries?: number): Promise<boolean>;

    /**
     * Stops any running backend services.
     * @returns A promise that resolves when the backend has been stopped.
     */
    stop_backend(): Promise<void>;
}
