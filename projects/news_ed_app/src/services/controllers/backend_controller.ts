import { BackendRunner } from "../entities/entities";
import { log } from "electron-log/main";

export class BackendController implements BackendRunner {
    runner: BackendRunner;

    constructor(runner: BackendRunner) {
        this.runner = runner;
    }
    async run_backend(path: string): Promise<void> {
        log(`BackendController::run_backend calling runner with: ${path}`);
        return this.runner.run_backend(path);
    }
    async test_backend(url: string, tries?: number): Promise<boolean> {
        return this.runner.test_backend(url, tries);
    }
    async stop_backend(): Promise<void> {
        return this.runner.stop_backend();
    }
}
