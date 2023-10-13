import Ajv from "ajv";
export interface MessageStrategy<TModel> {
    compile(ajv: Ajv): Promise<void>;
    getType(): string;
    toJson(model: TModel): string;
    fromJson(json: unknown): TModel;
    validate(json: unknown): boolean;
}
export declare class MessageParser {
    static typeKey: string;
    strategies: Map<string, MessageStrategy<unknown>>;
    private ajv;
    constructor(messageStrategies: MessageStrategy<unknown>[]);
    compile(): Promise<void>;
    parse(json: string): [string, unknown];
}
//# sourceMappingURL=message.d.ts.map