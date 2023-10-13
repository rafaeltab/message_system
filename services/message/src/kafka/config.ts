import { KafkaConfig } from "kafkajs";
import Ajv, { JSONSchemaType } from "ajv";
import { readFile } from "fs/promises";
import {injectable} from "inversify";

const configFile = "config/kafka.json";

const ajv = new Ajv();
type Config = {
    key: string,
    secret: string,
    bootstrap: {
        server: string
    }
}

const configSchema: JSONSchemaType<Config> = {
    type: "object",
    properties: {
        key: {
            type: "string"
        },
        secret: {
            type: "string"
        },
        bootstrap: {
            type: "object",
            properties: {
                server: {
                    type: "string"
                }
            },
            required: ["server"],
            additionalProperties: false
        }
    },
    required: ["bootstrap", "key", "secret"],
    additionalProperties: false
}
const validateConfig = ajv.compile(configSchema);

@injectable()
export class KafkaConfiguration {
    private _config?: KafkaConfig;

    public async getConfig(): Promise<KafkaConfig> {
        if(!this._config) await this.loadConfig();
        return this._config!;
    }

    private async loadConfig() {
        var content = await readFile(configFile, {encoding: "utf-8"});
        var parsed = JSON.parse(content);
        var isValid = validateConfig(parsed);
        if(!isValid) throw new Error("Invalid kafka configuration. The json file does not match the schema");
        var validConfig = parsed as Config;

        this._config = {
            brokers: [validConfig.bootstrap.server],
            sasl: {
                mechanism: "plain",
                username: validConfig.key,
                password: validConfig.secret,
            },
            clientId: "message-service",
            ssl: true
        }
    }
}

