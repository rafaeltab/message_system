import { Topic } from "../../types/topic";

export class NotificationTopic implements Topic {
    getTopic(): string {
        return "notificaiton";
    }
}
