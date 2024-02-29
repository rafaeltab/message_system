import { readFile, readdir } from "fs/promises";
import { DbConfig } from "../config/definition.js";
import { GlobalOptions } from "../global_options.js";
import { join } from "path";
import { driverFactory } from "../drivers/driver.js";
import { Client } from "pg";

export async function migrate(config: DbConfig, options: GlobalOptions) {
    // Get the project folder
    console.log("Starting migration...");
    const migrationFiles = await readdir(join(options.folder, config.changelogPath));
    console.log(`Found ${migrationFiles.length} migrations.`);

    let driver = driverFactory(config);
    await driver.waitTillOnline();

    const client = new Client({
        host: config.host,
        user: config.username,
        password: config.password,
        port: config.port,
        ssl: false,
        database: config.database,
    });
    await client.connect();
    await ensureMigrationTableExists(client);
    const performed = await getPerformedMigrations(client);

    for(let migrationFile of migrationFiles.filter(x => !performed.has(x))) {
        console.log(`Performing migration ${migrationFile}`);
        const migration = await readFile(join(options.folder, config.changelogPath, migrationFile), {encoding: "utf-8"});
        await client.query(migration);
        await addMigration(client, migrationFile);
    }
}

async function ensureMigrationTableExists(client: Client) {
    const migration_table_res = await client.query("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pg_migrations');");
    const exists = migration_table_res.rows[0].exists as boolean;
    if (exists == true) return;

    const schema = `CREATE TABLE pg_migrations (
    name VARCHAR
);`;
    await client.query(schema);
}

async function getPerformedMigrations(client: Client): Promise<Set<string>> {
    const sql = `SELECT * FROM pg_migrations;`;
    const result = await client.query(sql);
    return new Set(result.rows.map(x => x.name));
}

async function addMigration(client: Client, name: string) {
    const sql = `INSERT INTO pg_migrations VALUES ('${name}');`;
    await client.query(sql);
}
