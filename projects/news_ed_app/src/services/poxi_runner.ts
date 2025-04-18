import { BackendRunner } from "./entities/entities";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { log, error } from "electron-log";

export class PoxiSystemRunner implements BackendRunner {
    private process: ChildProcessWithoutNullStreams | null = null;

    async run_backend(path: string): Promise<void> {
        log(`Starting backend from: ${path}`);

        return new Promise((resolve, reject) => {
            this.process = spawn(path);

            // Add process output logging
            this.process.stdout.on("data", (data) => {
                log(`Backend stdout: ${data.toString().trim()}`);
            });

            this.process.stderr.on("data", (data) => {
                error(`Backend stderr: ${data.toString().trim()}`);
            });

            this.process.once("spawn", () => {
                log(`Backend process started (PID: ${this.process.pid})`);
                resolve();
            });

            this.process.once("error", (err) => {
                error(`Failed to start backend: ${err.message}`);
                this.cleanup();
                reject(err);
            });

            this.process.once("close", (code) => {
                log(`Backend process exited with code: ${code}`);
                this.cleanup();
            });
        });
    }

    async fetch_url(url: string): Promise<boolean> {
        try {
            const response = await fetch(url);
            if (response.ok) return true;
        } catch (e) {
            return false;
        }
    }

    async test_backend(url: string, tries?: number): Promise<boolean> {
        const maxRetries = typeof tries !== "undefined" ? tries : 10;
        const delay = 3000;
        let can_fech = await this.fetch_url(url);
        if (this.process !== null && can_fech) {
            return true;
        }

        for (let i = 0; i < maxRetries; i++) {
            can_fech = await this.fetch_url(url);
            if (can_fech) {
                return true;
            }

            error(`Connection attempt ${i + 1} failed, retrying`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        return false;
    }

    async stop_backend(): Promise<void> {
        if (!this.process) return;

        log(`Stopping backend process (PID: ${this.process.pid})`);
        this.process.kill();
        this.cleanup();
    }

    private cleanup() {
        if (this.process) {
            // Remove listeners to prevent memory leaks
            this.process.stdout.removeAllListeners();
            this.process.stderr.removeAllListeners();
            this.process.removeAllListeners();
            this.process = null;
        }
    }
}
