import { Chat } from "./chat";
import { User } from "./user";

export class Message {
    constructor(public id: bigint, public chat: Chat, public fromUser: User, public content: string, public sentAt: string) { }
}
