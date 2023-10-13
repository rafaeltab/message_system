import Ajv from "ajv";
import addFormats from "ajv-formats";
import { InvalidFormatException } from "./invalid_format_exception";
import { StrategyNotFoundException } from "./strategy_not_found_exception";

export interface MessageStrategy<TModel> {
    compile(ajv: Ajv): Promise<void>;
    getType(): string;
    toJson(model: TModel): string;
    fromJson(json: unknown): TModel;
    validate(json: unknown): boolean;
}

export class MessageParser {
    static typeKey = "type";
    strategies: Map<string, MessageStrategy<unknown>>;
    private ajv: Ajv;
    constructor(messageStrategies: MessageStrategy<unknown>[]) {
        this.ajv = new Ajv();
        addFormats(this.ajv);
        this.strategies = new Map();

        for (let strategy of messageStrategies) {
            this.strategies.set(strategy.getType(), strategy);
            console.log(`Adding strategy '${strategy.getType()}'`)
        }
    }

    async compile(){
        await Promise.all(Array.from(this.strategies, ([_, value]) => value.compile(this.ajv)));
    }

    parse(json: string): [string, unknown] {
        var parsed = JSON.parse(json);
        if (!(MessageParser.typeKey in parsed) || typeof parsed[MessageParser.typeKey] != "string") {
            throw new InvalidFormatException();
        }
        const type = parsed[MessageParser.typeKey];

        if(!this.strategies.has(type)){
            throw new StrategyNotFoundException(type);
        }

        const strategy = this.strategies.get(type)!;

        const valid: boolean = strategy.validate(parsed);

        if(!valid){
            throw new InvalidFormatException();
        }

        return [type, strategy.fromJson(parsed)];
    }
}
