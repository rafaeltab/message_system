import c from "picocolors";
import { DbConfig } from "./definition.js";
import { loadConfigFile } from "./pathExtractor.js";
import z from "zod";

const schema = z.object({
    host: z.string(),
    database: z.string(),
    username: z.optional(z.string()),
    password: z.optional(z.string()),
    changelogPath: z.string(),
    port: z.number(),
})

export async function loadConfig() : Promise<DbConfig> {
    const file = await loadConfigFile();
    const res = await schema.parseAsync(JSON.parse(file));
    console.log(`${c.green("Config successfully loaded")}`)
    return res;
}
