import { KafkaConfig, SASLOptions } from "kafkajs";
import Ajv, { JSONSchemaType } from "ajv";
import { readFile } from "fs/promises";
import { injectable } from "inversify";
import { existsSync } from "fs";

const configFile = "config/kafka.json";

const ajv = new Ajv();
type Config = {
    sasl?: {
        mechanism: "plain" | "scram-sha-256" | "scram-sha-512",
        username: string,
        password: string
    },
    bootstrap: {
        server: string
    }
}

const configSchema: JSONSchemaType<Config> = {
    type: "object",
    properties: {
        sasl: {
            type: "object",
            nullable: true,
            properties: {
                mechanism: {
                    type: "string",
                    enum: ["plain", "scram-sha-256", "scram-sha-512"]
                },
                username: {
                    type: "string" 
                },
                password: {
                    type: "string" 
                }
            },
            required: ["mechanism", "password", "username"],
            additionalProperties: false
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
    required: ["bootstrap"],
}
const validateConfig = ajv.compile(configSchema);

@injectable()
export class KafkaConfiguration {
    private _config?: KafkaConfig;

    public async getConfig(): Promise<KafkaConfig> {
        if (!this._config) await this.loadConfig();
        return this._config!;
    }

    private async loadConfig() {
        var content = await readFile(configFile, { encoding: "utf-8" });
        var parsed = JSON.parse(content);
        var isValid = validateConfig(parsed);
        if (!isValid) throw new Error("Invalid kafka configuration. The json file does not match the schema");
        var validConfig = parsed as Config;

        let brokers = validConfig.bootstrap.server.split(",");
        console.log(brokers);
        this._config = {
            brokers: brokers,
            clientId: "message-service",
        }

        if(existsSync("config/ca.crt")) {
            console.log("Running kafka client with SSL enabled");
            this._config.ssl = {
                ca: await readFile("config/ca.crt", "utf-8")
            }
        }else {
            console.log("Running kafka client with SSL disabled");
            this._config.ssl = false;
        }

        if (typeof validConfig.sasl === "object") {
            console.log(`Connecting with SASL enabled using the '${validConfig.sasl.username}' user`);
            let sasl : SASLOptions = validConfig.sasl!;
            this._config.sasl = sasl;
        }
    }
}

