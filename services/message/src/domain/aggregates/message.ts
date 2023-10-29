import { Chat } from "./chat";
import { User } from "./user";

export class Message {
    constructor(public id: number, public chat: Chat, public fromUser: User, public content: string, public sentAt: string) { }
}
