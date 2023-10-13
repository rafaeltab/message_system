import { MessageStrategy } from "../../types/message";
import Ajv from "ajv";
export declare class SendMessageRequestedStrategy implements MessageStrategy<SendMessageRequestedMessageModel> {
    private _compiled?;
    compile(ajv: Ajv): Promise<void>;
    static type: string;
    getType(): string;
    toJson(model: SendMessageRequestedMessageModel): string;
    fromJson(json: unknown): SendMessageRequestedMessageModel;
    validate(json: unknown): boolean;
}
export type SendMessageRequestedMessageModel = {
    type: string;
    chat: {
        from_user: {
            user_id: string;
        };
        to_user: {
            user_id: string;
        };
    };
    content: string;
    created_at: string;
};
//# sourceMappingURL=send_message_requested.d.ts.map