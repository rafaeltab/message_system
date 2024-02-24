import { Result, Option } from "utils";
import { Chat } from "../aggregates/chat";
import { User } from "../aggregates/user";
import { injectable } from "inversify";

@injectable()
export abstract class IChatRepository {
    abstract createChat(userA: User, userB: User): Promise<Result<Chat, Error>>; 
    abstract getChat(users: [User, User]): Promise<Result<Option<Chat>, Error>>;
}
