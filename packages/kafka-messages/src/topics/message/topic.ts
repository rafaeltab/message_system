import { Topic } from "../../types/topic";

export class MessageTopic implements Topic {
    getTopic(): string {
        return "message_message";
    }
}
