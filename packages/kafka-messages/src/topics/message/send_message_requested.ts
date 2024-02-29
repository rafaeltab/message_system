import { MessageStrategy } from "../../types/message";
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";
import { SendMessageCompleteStrategy } from "./send_message_complete";

const schema: JSONSchemaType<SendMessageRequestedMessageModel> = {
    "type": "object",
    "properties": {
        "chat": {
            "type": "object",
            "properties": {
                "from_user": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "integer"
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
                            "type": "integer"
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
        "type"
    ]
}

export class SendMessageRequestedStrategy implements MessageStrategy<SendMessageRequestedMessageModel>{
    private _compiled?: ValidateFunction<SendMessageRequestedMessageModel>;
    async compile(ajv: Ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "SendMessageRequested";
    getType(): string {
        return SendMessageRequestedStrategy.type;
    }
    toJson(model: SendMessageRequestedMessageModel): string {
        return JSON.stringify(model);
    }
    fromJson(json: unknown): SendMessageRequestedMessageModel {
        return json as SendMessageRequestedMessageModel;
    }
    validate(json: unknown): boolean {
        if (!this._compiled) throw new StrategyNotCompiledException();
        return this._compiled(json);
    }
}

export type SendMessageRequestedMessageModel = {
    type: string
    chat: {
        from_user: {
            user_id: number
        },
        to_user: {
            user_id: number
        }
    },
    content: string,
    created_at: string
}


