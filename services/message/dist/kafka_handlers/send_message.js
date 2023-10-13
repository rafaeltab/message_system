// TODO: add a kafka consumer for the send message event
// It should persist the event to a database
// After persisting to a database it should fire two kafka events
// - UserMessageSent with userId being the sender and to being the receiver
// - UserMessageReceived with userId being the receiver and from being the sender
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
import { KafkaConsumer } from "../kafka/consumer";
import { SendMessageTopic } from "../kafka/topics/send_message";
import { SendMessageRequestedStrategy } from "kafka-messages/dist/topics/message/send_message_requested";
import { MessageParser } from "kafka-messages";
let SendMessageKafkaHandler = class SendMessageKafkaHandler {
    _consumer;
    _topic;
    _parser;
    constructor(_consumer, _topic, _parser) {
        this._consumer = _consumer;
        this._topic = _topic;
        this._parser = _parser;
    }
    async startListening() {
        var consumer = await this._consumer.getConsumer("send-message-group");
        await consumer.subscribe({
            topic: this._topic.getTopic(),
            fromBeginning: true
        });
        await consumer.run({
            eachMessage: this.handleMessage.bind(this)
        });
    }
    async handleMessage({ message }) {
        if (message.value == null)
            return;
        var parseResult = this._parser.parse(message.value.toString());
        if (parseResult[0] != SendMessageRequestedStrategy.type) {
            return;
        }
        const model = parseResult[1];
        console.log(model);
    }
};
SendMessageKafkaHandler = __decorate([
    injectable(),
    __param(0, inject(KafkaConsumer)),
    __param(1, inject(SendMessageTopic)),
    __param(2, inject(MessageParser))
], SendMessageKafkaHandler);
export { SendMessageKafkaHandler };
