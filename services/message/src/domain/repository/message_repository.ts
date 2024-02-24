import { Result } from "utils";
import { Chat } from "../aggregates/chat";
import { Message } from "../aggregates/message";
import { User } from "../aggregates/user";
import { injectable } from "inversify";

@injectable()
export abstract class IMessageRepository {
    abstract createMessage(chat: Chat, content: string, sentAt: string, fromUser: User): Promise<Result<Message, Error>>;
}
