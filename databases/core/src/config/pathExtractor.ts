import { readdir, readFile } from "fs/promises";
import { bold, red } from "picocolors";

const CONFIG_NAME = ".dbconfig.json";

export async function loadConfigFile(): Promise<string> {
    const cwd = process.cwd();
    const dir = await readdir(cwd);
    if (!dir.includes(CONFIG_NAME)) {
        console.log(`${red(bold("Config not found!"))}`)
    }
    console.log(`${bold("Config found")}`)
    
    return await readFile(CONFIG_NAME, {
        encoding: "utf8"
    });
}
