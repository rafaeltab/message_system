import { DbConfig, DbConfigLoader } from "database-core";
import { injectable } from "inversify";

@injectable()
export class DbConfigProvider {
    constructor(private configLoader: DbConfigLoader, private environment: string){}

    async load() {
        this._dbConfig = await this.configLoader.loadConfig(this.environment);
    }

    private _dbConfig?: DbConfig;
    public get dbConfig (): DbConfig {
        if(this._dbConfig == null) throw Error("Db config not yet loaded");
        return this._dbConfig;
    } 
}
