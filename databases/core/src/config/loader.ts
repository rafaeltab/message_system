import c from "picocolors";
import { DbConfig } from "./definition.js";
import z from "zod";
import { GlobalOptions } from "../global_options.js";
import { join } from "path";
import { readFile, readdir } from "fs/promises";

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

export async function loadConfig(options: GlobalOptions): Promise<DbConfig> {
    const fileLoadResults = await loadConfigFiles([".dbconfig.json", `.dbconfig.${options.environment}.json`], options);
    if (fileLoadResults.find(x => x.status == "rejected") != undefined) {
        process.exit(1);
    }

    const contents = fileLoadResults.map(x => x.status == "fulfilled" ? x.value : undefined) as string[];
    let final = {};
    for (const content of contents) {
        Object.assign(final, JSON.parse(content));
    }

    try {
        const res = await schema.parseAsync(final);

        console.log(`${c.green("Config successfully loaded")}`);
        return res;
    } catch (err) {
        console.error(`${c.red("Error while parsing config")}`);
        if (options.verbose) {
            console.log(err);
        }
        process.exit(1);
    }
}

async function loadConfigFiles(files: string[], options: GlobalOptions) {
    const dir = await readdir(options.folder);
    const foundConfigs = files.filter(x => dir.includes(x));

    if (foundConfigs.length == 0) {
        console.log(`${c.red(c.bold("No config found!"))}`)
    }

    console.log(`${c.bold("Config found")}`)
    const fullPaths = foundConfigs.map(x => join(options.folder, x));
    return await Promise.allSettled(fullPaths.map(x => loadFile(x)));
}

async function loadFile(path: string): Promise<string> {
    try {
        return await readFile(path, {
            encoding: "utf8"
        });
    } catch (err) {
        console.log(`${c.red(c.bold(`Failed reading config file ${path}`))}`)
        throw err;
    }
}
