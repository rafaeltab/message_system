import postgres from "postgres";
import { inject, injectable } from "inversify";
import { DbConfigProvider } from "./config";

@injectable()
export class PostgressConnection {
    private post: postgres.Sql<{
        bigint: bigint,
        int: bigint
    }>;

    constructor(@inject(DbConfigProvider) configProvider: DbConfigProvider) {
        const dbConf = configProvider.dbConfig;
        this.post = postgres({
            db: dbConf.database,
            host: dbConf.host,
            ssl: "prefer",
            password: dbConf.password,
            username: dbConf.username,
            port: dbConf.port,
            types: {
                bigint: postgres.BigInt,
                int: postgres.BigInt
            }
        });
    }

    get sql() {
        return this.post;
    }
}

