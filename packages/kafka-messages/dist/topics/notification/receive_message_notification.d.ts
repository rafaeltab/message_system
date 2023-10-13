import { MessageStrategy } from "../../types/message";
import Ajv from "ajv";
export declare class ReceiveMessageStrategy implements MessageStrategy<ReceiveMessageNotificationModel> {
    private _compiled?;
    compile(ajv: Ajv): Promise<void>;
    static type: string;
    getType(): string;
    toJson(model: ReceiveMessageNotificationModel): string;
    fromJson(json: unknown): ReceiveMessageNotificationModel;
    validate(json: unknown): boolean;
}
export type ReceiveMessageNotificationModel = {
    type: string;
    user_id: string;
    chat: {
        from_user: {
            user_id: string;
        };
    };
    content: string;
    created_at: string;
};
//# sourceMappingURL=receive_message_notification.d.ts.map