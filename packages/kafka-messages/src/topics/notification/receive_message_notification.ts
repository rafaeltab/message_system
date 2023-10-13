import { MessageStrategy } from "../../types/message";
import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";

const schema: JSONSchemaType<ReceiveMessageNotificationModel> = {
    "type": "object",
    "properties": {
        "user_id": {
            "type": "string"
        },
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
                }
            },
            "required": [
                "from_user",
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

export class ReceiveMessageStrategy implements MessageStrategy<ReceiveMessageNotificationModel>{
    private _compiled?: ValidateFunction<ReceiveMessageNotificationModel>;
    async compile(ajv: Ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "ReceiveMessage";
    getType(): string {
        return ReceiveMessageStrategy.type;
    }
    toJson(model: ReceiveMessageNotificationModel): string {
        return JSON.stringify(model);
    }
    fromJson(json: unknown): ReceiveMessageNotificationModel {
        return json as ReceiveMessageNotificationModel;
    }
    validate(json: unknown): boolean {
        if (!this._compiled) throw new StrategyNotCompiledException();
        return this._compiled(json);
    }
}

export type ReceiveMessageNotificationModel = {
    type: string
    user_id: string,
    chat: {
        from_user: {
            user_id: string
        },
    },
    content: string,
    created_at: string
}


