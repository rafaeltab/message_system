import { DbConfig } from "./definition.js";
import z from "zod";
import { join } from "path";
import { readFile } from "fs/promises";

const schema = z.object({
    host: z.string(),
    database: z.string(),
    username: z.optional(z.string()),
    password: z.optional(z.string()),
    changelogPath: z.string(),
    port: z.number(),
    driver: z.union([
        z.object({
            name: z.literal("kubectl"),
            pod: z.string(),
            namespace: z.optional(z.string())
        }),
        z.object({
            name: z.literal("docker"),
            container: z.string()
        })
    ])
})

export interface ConfigFileLoader {
    loadFile(configFile: string): Promise<unknown>;
}


export class FileReadConfigFileLoader implements ConfigFileLoader {
    constructor(private folder: string) { }

    async loadFile(configFile: string): Promise<unknown> {
        return JSON.parse(await readFile(join(this.folder, configFile), { encoding: "utf8" }));
    }
}

export class DbConfigLoader {
    constructor(private fileLoader: ConfigFileLoader) { }

    async loadConfig(environment: string): Promise<DbConfig> {
        const configSources = [".dbconfig.json", `.dbconfig.${environment}.json`];
        const fileLoadResults = await Promise.allSettled(configSources.map(x => this.fileLoader.loadFile(x)));
        fileLoadResults.filter(x => x.status == "rejected").forEach(x => console.error(x));
        const fileSuccessResults = fileLoadResults
            .map(x => x.status == "fulfilled" ? x.value : undefined)
            .filter(x => x != undefined) as string[];

        if (fileSuccessResults.length == 0) {
            throw Error("No config found");
        }

        let final = {};
        for (const content of fileSuccessResults) {
            Object.assign(final, content);
        }

        const res = await schema.parseAsync(final);

        return res;
    }
}

