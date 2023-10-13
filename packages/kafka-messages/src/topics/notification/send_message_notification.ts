import { MessageStrategy } from "../../types/message";
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";

const schema: JSONSchemaType<SendMessageNotificationModel> = {
    "type": "object",
    "properties": {
        "user_id": {
            "type": "string"
        },
        "chat": {
            "type": "object",
            "properties": {
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
                "to_user",
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

export class SendMessageStrategy implements MessageStrategy<SendMessageNotificationModel>{
    private _compiled?: ValidateFunction<SendMessageNotificationModel>;
    async compile(ajv: Ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "SendMessage";
    getType(): string {
        return SendMessageStrategy.type;
    }
    toJson(model: SendMessageNotificationModel): string {
        return JSON.stringify(model);
    }
    fromJson(json: unknown): SendMessageNotificationModel {
        return json as SendMessageNotificationModel;
    }
    validate(json: unknown): boolean {
        if (!this._compiled) throw new StrategyNotCompiledException();
        return this._compiled(json);
    }
}

export type SendMessageNotificationModel = {
    type: string
    user_id: string,
    chat: {
        to_user: {
            user_id: string
        },
    },
    content: string,
    created_at: string
}


