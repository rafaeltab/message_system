#!/usr/bin/env node

import { migrate } from "./commands/migrate.js";
import { setup } from "./commands/setup.js";

import { Command } from "commander";
import { DbConfigLoader, FileReadConfigFileLoader } from "./config/loader.js";
import { GlobalOptions, addGlobalOptions } from "./global_options.js";

const program = new Command("db");

program
    .name("db")
    .description("Manage databases")
    .version("0.0.1")

addGlobalOptions(program
    .command("migrate")
    .description("Apply migrations to a database"))
    .action(async (options: GlobalOptions) => {
        const configFileLoader = new FileReadConfigFileLoader(options.folder);
        const dbConfigProvider = new DbConfigLoader(configFileLoader);
        const config = await dbConfigProvider.loadConfig(options.environment);

        migrate(config, options);
    });

addGlobalOptions(program
    .command("setup")
    .description("Setup a database"))
    .action(async (options: GlobalOptions) => {
        const configFileLoader = new FileReadConfigFileLoader(options.folder);
        const dbConfigProvider = new DbConfigLoader(configFileLoader);
        const config = await dbConfigProvider.loadConfig(options.environment);

        setup(config, options);
    });

program.parse();
// TODO add preview, backup and restore
