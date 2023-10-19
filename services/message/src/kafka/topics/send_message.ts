import { KafkaAdmin } from "../admin";
import { KafkaProducer } from "../producer";
import { Topic } from "./topic";
import { injectable, inject } from "inversify";
import { MessageTopic } from "kafka-messages/dist/topics/message/topic";

@injectable()
export class SendMessageTopic extends Topic {
    private _topic = new MessageTopic();
    constructor(@inject(KafkaAdmin) admin: KafkaAdmin, @inject(KafkaProducer) producer: KafkaProducer){
        super(producer, admin);
    }
        
    getTopic(): string {
        return this._topic.getTopic();
    }
}
