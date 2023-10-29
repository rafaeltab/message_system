import postgres from "postgres";
import type { DbConfig } from "database-core/dist/definition";
import config from "message-database/.dbconfig.json" assert { type: "json" };
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
