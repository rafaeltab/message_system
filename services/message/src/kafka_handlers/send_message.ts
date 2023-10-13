// TODO: add a kafka consumer for the send message event
// It should persist the event to a database
// After persisting to a database it should fire two kafka events
// - UserMessageSent with userId being the sender and to being the receiver
// - UserMessageReceived with userId being the receiver and from being the sender

import { inject, injectable } from "inversify";
import { KafkaConsumer } from "../kafka/consumer";
import { SendMessageTopic } from "../kafka/topics/send_message";
import { EachMessagePayload } from "kafkajs";
import { SendMessageRequestedMessageModel, SendMessageRequestedStrategy } from "kafka-messages/dist/topics/message/send_message_requested";
import { MessageParser } from "kafka-messages";


@injectable()
export class SendMessageKafkaHandler {
    constructor(
        @inject(KafkaConsumer) private _consumer: KafkaConsumer,
        @inject(SendMessageTopic) private _topic: SendMessageTopic,
        @inject(MessageParser) private _parser: MessageParser
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
        if(message.value == null) return;
        var parseResult = this._parser.parse(message.value.toString());
        if(parseResult[0] != SendMessageRequestedStrategy.type) {
            return;
        }

        const model = parseResult[1] as SendMessageRequestedMessageModel;
        console.log(model);
    }
}
