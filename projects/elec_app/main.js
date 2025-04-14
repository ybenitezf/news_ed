const { app, BrowserWindow } = require('electron')
const { log } = require('electron-log/main');
const path = require('node:path');
const { exec } = require('child_process');

// log in ~/Library/Logs/node_pkg_name/main.log
log("starting");
console.log = log;

backend = path.join(__dirname, 'papp', 'runner');
log(`Current dir: ${__dirname}`);
log(`Loking for backend in: ${backend}`);
let backend_pid = null;


async function search_backend(back_cmd) {
    return new Promise((resolve, reject) => {
        exec(`ps aux | grep "${back_cmd}"`, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            const lines = stdout.split('\n');
            console.log(`Found ${lines.length} lines`);
            for (const line of lines) {
                console.log(`Maching with ${line}`);
                const pidMatch = line.match(/\d+/);
                if (pidMatch && !line.includes('grep')) {
                    const pid = parseInt(pidMatch[0]);
                    console.log(`Killing backend process with PID: ${pid}`);
                    process.kill(pid);
                }
            }

            resolve(null);
        });
    });
}


async function runBackend() {
    if (backend_pid != null) {
        console.log(`already running ${backend_pid}`);
        return backend_pid
    }
    child = exec(`sh -c "${backend}"`)
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        console.log('stderr: ' + data);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        console.log('stderr: ' + data);
    });
    child.on('exit', (code) => {
        console.log(`child process exited with code ${code}`);
        backend_pid = null;
    });
    child.on('error', (error) => {
        console.log(`child process error ${error}`);
    });
    console.log(`child pid: ${child.pid}`);
    return child.pid;
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.loadFile('index.html');
    return win
}

async function test_backend(url) {
    console.log(`test backend ${url}`);
    try {
        response = await fetch(url);
        if (!response.ok) {
            console.log(`HTTP error, status = ${response.status}`);
            return false;
        }
        console.log("backend running");
        return true;
    } catch (error) {
        console.log("no connection");
        return false;
    }
}

async function sleep(ms) {
    console.log(`sleep ${ms}`);
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

async function start_backend(url, times, wait_time) {  // The bridge
    result = await test_backend(url);
    if( result ){
        console.log("backend running");
        return;
    } else {
        console.log("starting backend");
        await runBackend();
        await sleep(wait_time);
    }

    for (let i = 0; i < times; i++) {
        console.log(`try ${i}`);
        const result = await test_backend(url);
        if (result) {
            return;
        }
        await sleep(wait_time);
    }
    console.log("Cant start the backend");
    throw new Error("Can't start the backend");
}

app.on('ready', () => {
    win = createWindow();
    start_backend('http://127.0.0.1:8000', 10, 3000).then((result) => {
        console.log("loading landing page");
        win.loadURL('http://127.0.0.1:8000');
    }).catch((error) => {
        console.log(error);
    });
})

app.on("window-all-closed", () => {
    console.log(`"window-all-closed" ${process.pid}`);
    search_backend("papp/runner").then((pid) => {
        console.log(`All backend processes killed`);
        app.quit();
    }).catch((error) => {
        console.log(error);
    });
});
