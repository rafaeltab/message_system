import { Result } from "utils";
import { Chat } from "../aggregates/chat";
import { Message } from "../aggregates/message";

export abstract class IMessageRepository {
    abstract createMessage(chat: Chat, content: string, sentAt: string): Promise<Result<Message, Error>>;
}
