import { MessageStrategy } from "../../types/message";
import Ajv from "ajv";
export declare class SendMessageCompleteStrategy implements MessageStrategy<SendMessageCompletedMessageModel> {
    private _compiled?;
    compile(ajv: Ajv): Promise<void>;
    static type: string;
    getType(): string;
    toJson(model: SendMessageCompletedMessageModel): string;
    fromJson(json: unknown): SendMessageCompletedMessageModel;
    validate(json: unknown): boolean;
}
export type SendMessageCompletedMessageModel = {
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
//# sourceMappingURL=send_message_complete.d.ts.map