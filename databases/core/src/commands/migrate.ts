import { readdir } from "fs/promises";
import { loadConfig } from "../config/loader.js";

export async function migrate(){
    // Get the project folder
    const config = await loadConfig();
    const migrationFiles = await readdir(config.changelogPath);
    console.log(migrationFiles);
}
