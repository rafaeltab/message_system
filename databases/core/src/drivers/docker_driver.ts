import { spawn } from "node:child_process";
import { IDriver } from "./driver";

export class DockerDriver implements IDriver {
    constructor(private container: string) {}
    waitTillOnline(): Promise<void> {
        return Promise.resolve();
    }
    async executeSql(sql: string): Promise<void> {
        const docker = spawn('docker', ["exec", "-i", this.container, "./cockroach", "sql", "--insecure"]);

        docker.stdout.on('data', data => console.log(`Stdout: ${data}`));
        docker.stderr.on('data', data => console.log(`Stderr: ${data}`));
        docker.on('close', code => console.log(`Exit code: ${code}`));
        docker.stdin.write(sql);
        setTimeout(() => {
            docker.kill();
        }, 5000);
    }
}
