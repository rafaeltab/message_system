import { green } from "picocolors";
import { DbConfig } from "./definition";
import { loadConfigFile } from "./pathExtractor";
import z from "zod";

const schema = z.object({
    host: z.string(),
    database: z.string(),
    username: z.string(),
    password: z.string(),
    changelogPath: z.string()
})

export async function loadConfig() : Promise<DbConfig> {
    const file = await loadConfigFile();
    const res = await schema.parseAsync(JSON.parse(file));
    console.log(`${green("Config successfully loaded")}`)
    return res;
}
