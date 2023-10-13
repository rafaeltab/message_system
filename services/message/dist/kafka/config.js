var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Ajv from "ajv";
import { readFile } from "fs/promises";
import { injectable } from "inversify";
const configFile = "config/kafka.json";
const ajv = new Ajv();
const configSchema = {
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
};
const validateConfig = ajv.compile(configSchema);
let KafkaConfiguration = class KafkaConfiguration {
    _config;
    async getConfig() {
        if (!this._config)
            await this.loadConfig();
        return this._config;
    }
    async loadConfig() {
        var content = await readFile(configFile, { encoding: "utf-8" });
        var parsed = JSON.parse(content);
        var isValid = validateConfig(parsed);
        if (!isValid)
            throw new Error("Invalid kafka configuration. The json file does not match the schema");
        var validConfig = parsed;
        this._config = {
            brokers: [validConfig.bootstrap.server],
            sasl: {
                mechanism: "plain",
                username: validConfig.key,
                password: validConfig.secret,
            },
            clientId: "message-service",
            ssl: true
        };
    }
};
KafkaConfiguration = __decorate([
    injectable()
], KafkaConfiguration);
export { KafkaConfiguration };
