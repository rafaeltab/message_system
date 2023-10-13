import { MessageStrategy } from "../../types/message";
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";

const schema: JSONSchemaType<SendMessageCompletedMessageModel> = {
    "type": "object",
    "properties": {
        "chat": {
            "type": "object",
            "properties": {
                "from_user": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "user_id"
                    ]
                },
                "to_user": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "user_id"
                    ]
                }
            },
            "required": [
                "from_user",
                "to_user"
            ]
        },
        "content": {
            "type": "string"
        },
        "created_at": {
            "type": "string",
            "format": "date-time"
        },
        "type": {
            "type": "string"
        }
    },
    "required": [
        "chat",
        "content",
        "created_at",
        "type"
    ]
}

export class SendMessageCompleteStrategy implements MessageStrategy<SendMessageCompletedMessageModel>{
    private _compiled?: ValidateFunction<SendMessageCompletedMessageModel>;
    async compile(ajv: Ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "SendMessageComplete";
    getType(): string {
        return SendMessageCompleteStrategy.type;
    }
    toJson(model: SendMessageCompletedMessageModel): string {
        return JSON.stringify(model);
    }
    fromJson(json: unknown): SendMessageCompletedMessageModel {
        return json as SendMessageCompletedMessageModel;
    }
    validate(json: unknown): boolean {
        if (!this._compiled) throw new StrategyNotCompiledException();
        return this._compiled(json);
    }
}

export type SendMessageCompletedMessageModel = {
    type: string
    chat: {
        from_user: {
            user_id: string
        },
        to_user: {
            user_id: string
        }
    },
    content: string,
    created_at: string
}


