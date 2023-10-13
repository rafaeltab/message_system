import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";
const schema = {
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
};
export class SendMessageStrategy {
    _compiled;
    async compile(ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "SendMessage";
    getType() {
        return SendMessageStrategy.type;
    }
    toJson(model) {
        return JSON.stringify(model);
    }
    fromJson(json) {
        return json;
    }
    validate(json) {
        if (!this._compiled)
            throw new StrategyNotCompiledException();
        return this._compiled(json);
    }
}
