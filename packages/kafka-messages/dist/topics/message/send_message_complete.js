import { StrategyNotCompiledException } from "../../types/strategy_not_compiled_exception";
const schema = {
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
};
export class SendMessageCompleteStrategy {
    _compiled;
    async compile(ajv) {
        this._compiled = ajv.compile(schema);
    }
    static type = "SendMessageComplete";
    getType() {
        return SendMessageCompleteStrategy.type;
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
