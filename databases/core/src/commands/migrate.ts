import { readdir } from "fs/promises";
import { loadConfig } from "../config/loader";

export async function migrate(){
    // Get the project folder
    const config = await loadConfig();
    const migrationFiles = await readdir(config.changelogPath);
    console.log(migrationFiles);
}
