import { loadConfig } from "../config/loader.js";
import { spawn } from "child_process";

export async function setup() {
    console.log(`Starting setup...`);
    const config = await loadConfig();
    await waitForReadyPod();
    const kubectl = spawn('kubectl', ["exec", "-it", "cockroachdb-0", "--", "./cockroach", "sql", "--host=cockroachdb-public", "--insecure"]);
    const sql = `
CREATE DATABASE ${config.database};
CREATE USER ${config.username}${config.password == "" ? "" : " WITH PASSWORD " + config.password};
GRANT ALL ON DATABASE ${config.database} TO ${config.username};
`;

    kubectl.stdout.on('data', data => console.log(`Stdout: ${data}`));
    kubectl.stderr.on('data', data => console.log(`Stderr: ${data}`));
    kubectl.on('close', code => console.log(`Exit code: ${code}`));
    kubectl.stdin.write(sql);
    setTimeout(() => {
        kubectl.kill();
    }, 5000);
}

function waitForReadyPod(): Promise<void> {
    return new Promise((resolve, reject) => {
        const kubectl = spawn('kubectl', ["wait", "--for=condition=ready", "pod", "cockroachdb-0"]);
        kubectl.stdout.on('data', data => console.log(`Stdout: ${data}`));
        kubectl.stderr.on('data', data => console.log(`Stderr: ${data}`));
        kubectl.on('close', (code) => {
            if (code == 0) resolve();
            else reject(code);
        });
    });
}
