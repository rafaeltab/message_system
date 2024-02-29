import { ConfigFileLoader } from "database-core";
import { join } from "path";

export class ImportConfigFileLoader implements ConfigFileLoader {
    constructor(private pckg: string) { }

    async loadFile(configFile: string): Promise<unknown> {
        const path = join(this.pckg, configFile);
        const res = await import(path, {assert: {type: "json"}});
        return res["default"];
    }
}
