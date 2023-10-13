import { Topic } from "../../types/topic";

export class MessageTopic implements Topic {
    getTopic(): String {
        return "message";
    }
}
