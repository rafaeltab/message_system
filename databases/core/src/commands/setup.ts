import { DbConfig } from "../index.js";
import { GlobalOptions } from "../global_options.js";
import { driverFactory } from "../drivers/driver.js";

export async function setup(config: DbConfig, options: GlobalOptions) {
    console.log(`Starting setup...`);
    let driver = driverFactory(config);

    await driver.waitTillOnline();
    const sql = `
CREATE DATABASE ${config.database};
CREATE USER ${config.username}${(config.password ?? "") == "" ? "" : " WITH PASSWORD " + config.password};
GRANT ALL ON DATABASE ${config.database} TO ${config.username};
`;
    await driver.executeSql(sql);
}

