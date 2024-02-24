import { readdir, readFile } from "fs/promises";
import c from "picocolors";

const CONFIG_NAME = ".dbconfig.json";

export async function loadConfigFile(): Promise<string> {
    const cwd = process.cwd();
    const dir = await readdir(cwd);
    if (!dir.includes(CONFIG_NAME)) {
        console.log(`${c.red(c.bold("Config not found!"))}`)
    }
    console.log(`${c.bold("Config found")}`)
    
    return await readFile(CONFIG_NAME, {
        encoding: "utf8"
    });
}
