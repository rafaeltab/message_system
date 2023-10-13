import Ajv from "ajv";
import addFormats from "ajv-formats";
import { InvalidFormatException } from "./invalid_format_exception";
import { StrategyNotFoundException } from "./strategy_not_found_exception";
export class MessageParser {
    static typeKey = "type";
    strategies;
    ajv;
    constructor(messageStrategies) {
        this.ajv = new Ajv();
        addFormats(this.ajv);
        this.strategies = new Map();
        for (let strategy of messageStrategies) {
            this.strategies.set(strategy.getType(), strategy);
            console.log(`Adding strategy '${strategy.getType()}'`);
        }
    }
    async compile() {
        await Promise.all(Array.from(this.strategies, ([_, value]) => value.compile(this.ajv)));
    }
    parse(json) {
        var parsed = JSON.parse(json);
        if (!(MessageParser.typeKey in parsed) || typeof parsed[MessageParser.typeKey] != "string") {
            throw new InvalidFormatException();
        }
        const type = parsed[MessageParser.typeKey];
        if (!this.strategies.has(type)) {
            throw new StrategyNotFoundException(type);
        }
        const strategy = this.strategies.get(type);
        const valid = strategy.validate(parsed);
        if (!valid) {
            throw new InvalidFormatException();
        }
        return [type, strategy.fromJson(parsed)];
    }
}
