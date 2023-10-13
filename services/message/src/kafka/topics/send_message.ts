import { KafkaAdmin } from "../admin";
import { KafkaProducer } from "../producer";
import { Topic } from "./topic";
import { injectable, inject } from "inversify";

@injectable()
export class SendMessageTopic extends Topic {
    constructor(@inject(KafkaAdmin) admin: KafkaAdmin, @inject(KafkaProducer) producer: KafkaProducer){
        super(producer, admin);
    }
        
    getTopic(): string {
        return "send-message";
    }
}
