// TODO: add a kafka consumer for the send message event
// It should persist the event to a database
// After persisting to a database it should fire two kafka events
// - UserMessageSent with userId being the sender and to being the receiver
// - UserMessageReceived with userId being the receiver and from being the sender

import { inject, injectable } from "inversify";
import { KafkaConsumer } from "../kafka/consumer";
import { SendMessageTopic } from "../kafka/topics/send_message";
import { EachMessagePayload } from "kafkajs";
import { MessageParser, SendMessageCompleteStrategy, SendMessageCompletedMessageModel, SendMessageRequestedMessageModel, SendMessageRequestedStrategy } from "kafka-messages";
import { MessageFactory } from "../domain/factories/message_factory";
import { KafkaProducer } from "../kafka/producer";

@injectable()
export class SendMessageKafkaHandler {
    constructor(
        @inject(KafkaConsumer) private _consumer: KafkaConsumer,
        @inject(SendMessageTopic) private _topic: SendMessageTopic,
        @inject(MessageParser) private _parser: MessageParser,
        @inject(MessageFactory) private _messageFactory: MessageFactory,
        @inject(SendMessageTopic) private _sendMessageTopic: SendMessageTopic,
    ) {
    }

    async startListening() {
        var consumer = await this._consumer.getConsumer("send-message-group");
        await consumer.subscribe({
            topic: this._topic.getTopic(),

            fromBeginning: true
        })
        await consumer.run({
            eachMessage: this.handleMessage.bind(this)
        });
    }

    async handleMessage({ message }: EachMessagePayload) {
        try {
            if (message.value == null) return;
            var parseResult = this._parser.parse(message.value.toString());
            if (parseResult[0] != SendMessageRequestedStrategy.type) {
                return;
            }

            const model = parseResult[1] as SendMessageRequestedMessageModel;
            const msgResult = await this._messageFactory.createMessage(
                BigInt(model.chat.to_user.user_id),
                BigInt(model.chat.from_user.user_id),
                model.content,
                model.created_at);
            if (msgResult.isErr()) {
                throw msgResult.asErr().error;
            }

            var kakfaMessage: SendMessageCompletedMessageModel = {
                chat: {
                    to_user: {
                        user_id: model.chat.to_user.user_id.toString()
                    },
                    from_user: {
                        user_id: model.chat.from_user.user_id.toString()
                    }
                },
                type: SendMessageCompleteStrategy.type,
                content: model.content,
                created_at: model.created_at
            }

            await this._sendMessageTopic.send({
                key: `${model.chat.to_user.user_id}-${model.chat.from_user.user_id}`,
                value: kakfaMessage
            });

            console.log("Stored a new message", msgResult);
        } catch (err) {
            console.error(err);
            throw "";
        }
    }
}
