import { app, BrowserWindow } from "electron";
import { log } from "electron-log/main";
import { get_backend_runner } from "./services/factories";
import * as path from "path";
import { BackendRunner } from "./services/entities/entities";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
const back_runner: BackendRunner = get_backend_runner();

log("starting");
let backend_path = path.join(process.resourcesPath, "runner");
if (process.platform === "win32") {
    backend_path = path.join(process.resourcesPath, "runner.exe");
}
log(`${process.resourcesPath}`);
log(`Current dir: ${__dirname}`);
log(`Loking for backend in: ${backend_path}`);

const startBackend = async (win: BrowserWindow) => {
    log("calling backend to start");
    try {
        if (await back_runner.test_backend("http://127.0.0.1:8000", 1)) {
            win.loadURL("http://127.0.0.1:8000");
        } else {
            await back_runner.run_backend(backend_path);
            if (await back_runner.test_backend("http://127.0.0.1:8000", 10)) {
                log("Backend started, loading page");
                win.loadURL("http://127.0.0.1:8000");
            }
        }
    } catch (error) {
        log(`Failed to start backend: ${error}`);
    }
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = (): BrowserWindow => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    return mainWindow;
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
    const win = createWindow();
    startBackend(win);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("will-quit", () => {
    back_runner.stop_backend().then(() => {
        log("Will quit");
    });
});

app.on("activate", () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        startBackend(createWindow());
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
