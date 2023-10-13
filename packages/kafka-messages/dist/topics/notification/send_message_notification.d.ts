import { MessageStrategy } from "../../types/message";
import Ajv from "ajv";
export declare class SendMessageStrategy implements MessageStrategy<SendMessageNotificationModel> {
    private _compiled?;
    compile(ajv: Ajv): Promise<void>;
    static type: string;
    getType(): string;
    toJson(model: SendMessageNotificationModel): string;
    fromJson(json: unknown): SendMessageNotificationModel;
    validate(json: unknown): boolean;
}
export type SendMessageNotificationModel = {
    type: string;
    user_id: string;
    chat: {
        to_user: {
            user_id: string;
        };
    };
    content: string;
    created_at: string;
};
//# sourceMappingURL=send_message_notification.d.ts.map