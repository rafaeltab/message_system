import postgres from "postgres";
import config from "message-database/.dbconfig.json" assert { type: "json" };
import { DbConfig } from "database-core";
import { injectable } from "inversify";

@injectable()
export class PostgressConnection {
    private post: postgres.Sql;
    constructor() {
        const dbConf: DbConfig = config;
        this.post = postgres({
            db: dbConf.database,
            host: dbConf.host,
            ssl: "prefer",
            password: dbConf.password == "" ? undefined : dbConf.password,
            username: dbConf.username
        });
    }

    get sql() {
        return this.post;
    }
}
