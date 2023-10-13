import { ServerErrorResponse, StatusObject } from "@grpc/grpc-js";
import { SendMessageRequest__Output } from "message-service-grpc/dist/proto/ts/services/message/v1/SendMessageRequest";
import { SendMessageResponse__Output } from "message-service-grpc/dist/proto/ts/services/message/v1/SendMessageResponse";
import { MessageHandler } from "./message_handler";
import { injectable, inject } from "inversify";
import { SendMessageTopic } from "../kafka/topics/send_message";
import { SendMessageRequestedMessageModel, SendMessageRequestedStrategy } from "kafka-messages/dist/topics/message/send_message_requested";

@injectable()
export class SendMessageHandler extends MessageHandler<SendMessageRequest__Output, SendMessageResponse__Output> {
    constructor(@inject(SendMessageTopic) private sendMessageTopic: SendMessageTopic) { super(); }

    protected async handle(req: SendMessageRequest__Output):
        Promise<[Partial<StatusObject> | ServerErrorResponse, null] | [null, SendMessageResponse__Output]> {
        try {
            if (req.chat?.toUser?.userId == null || req.chat.fromUser?.userId == null) return [{
                name: "ParameterNull",
                code: 5,
                cause: null
            }, null];


            var message: SendMessageRequestedMessageModel = {
                chat: {
                    to_user: {
                        user_id: req.chat.toUser.userId
                    },
                    from_user: {
                        user_id: req.chat.fromUser.userId
                    }
                },
                type: SendMessageRequestedStrategy.type,
                content: req.content,
                created_at: (new Date()).toISOString()
            }

            this.sendMessageTopic.send({
                key: `${req.chat.toUser.userId}-${req.chat.fromUser.userId}`,
                value: message
            });

            return [null, {
                msg: {
                    sentAt: message.created_at,
                    content: message.content
                }
            }];

        } catch (err) {
            return [{
                name: "unknown",
                code: 5,
                cause: err
            }, null];
        }
    }
}
