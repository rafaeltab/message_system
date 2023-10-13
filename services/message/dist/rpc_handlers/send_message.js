var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { MessageHandler } from "./message_handler";
import { injectable, inject } from "inversify";
import { SendMessageTopic } from "../kafka/topics/send_message";
import { SendMessageRequestedStrategy } from "kafka-messages/dist/topics/message/send_message_requested";
let SendMessageHandler = class SendMessageHandler extends MessageHandler {
    sendMessageTopic;
    constructor(sendMessageTopic) {
        super();
        this.sendMessageTopic = sendMessageTopic;
    }
    async handle(req) {
        try {
            if (req.chat?.toUser?.userId == null || req.chat.fromUser?.userId == null)
                return [{
                        name: "ParameterNull",
                        code: 5,
                        cause: null
                    }, null];
            var message = {
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
            };
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
        }
        catch (err) {
            return [{
                    name: "unknown",
                    code: 5,
                    cause: err
                }, null];
        }
    }
};
SendMessageHandler = __decorate([
    injectable(),
    __param(0, inject(SendMessageTopic))
], SendMessageHandler);
export { SendMessageHandler };
