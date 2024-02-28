import { spawn } from "node:child_process";
import { IDriver } from "./driver";

export class KubectlDriver implements IDriver {
    constructor(private pod: string, private namespace?: string) { }

    waitTillOnline(): Promise<void> {
        return new Promise((resolve, reject) => {
            const kubectl = spawn('kubectl', ["wait", "--for=condition=ready", "pod", this.pod, "-n", this.namespace ?? "default"]);
            kubectl.stdout.on('data', data => console.log(`Stdout: ${data}`));
            kubectl.stderr.on('data', data => console.log(`Stderr: ${data}`));
            kubectl.on('close', (code) => {
                if (code == 0) resolve();
                else reject(code);
            });
        });
    }
    async executeSql(sql: string): Promise<void> {
        const kubectl = spawn('kubectl', ["exec", "-it", this.pod, "-n", this.namespace ?? "default", "--", "./cockroach", "sql", "--host=cockroachdb-public", "--insecure"]);

        kubectl.stdout.on('data', data => console.log(`Stdout: ${data}`));
        kubectl.stderr.on('data', data => console.log(`Stderr: ${data}`));
        kubectl.on('close', code => console.log(`Exit code: ${code}`));
        kubectl.stdin.write(sql);
        setTimeout(() => {
            kubectl.kill();
        }, 5000);
    }
}
