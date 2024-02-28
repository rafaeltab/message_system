import { Command } from "commander";

export type GlobalOptions = {
    environment: string
    folder: string

    verbose: boolean
}

export function addGlobalOptions(command: Command): Command {
    return command
        .option("-v, --verbose", "Output everything, and I mean everything", false)
        .option("-E, --environment <string>", "The environment to use, default", "local")
        .option("--folder <string>", "The folder to run the command in", process.cwd());
}
