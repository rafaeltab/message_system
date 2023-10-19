import { IUserRepository } from "../repository/user_repository";
import { IMessageRepository } from "../repository/message_repository";
import { IChatRepository } from "../repository/chat_repository";
import { User } from "../aggregates/user";
import { Message } from "../aggregates/message";
import { Result } from "utils";
import { Chat } from "../aggregates/chat";

export class MessageFactory {
    constructor(private _userRepository: IUserRepository, private _chatRepository: IChatRepository, private _messageRepository: IMessageRepository) {

    }

    async createMessage(toUserId: string, fromUserId: string, content: string, sentAt: string): Promise<Result<Message, Error>> {
        var toUserPromise = this.ensureUser(toUserId);
        var fromUserPromise = this.ensureUser(fromUserId);
        var toUser = await toUserPromise;
        var fromUser = await fromUserPromise;

        if (toUser.isErr()) return new Result.Err(toUser.asErr().error);
        if (fromUser.isErr()) return new Result.Err(fromUser.asErr().error);

        var chatResult = (await this._chatRepository.getChat([toUser.asOk().value, fromUser.asOk().value]));
        if (chatResult.isErr()) return new Result.Err(chatResult.asErr().error);

        let chat: Chat;
        if (chatResult.asOk().value.isNone()) {
            const secondResult = await this._chatRepository.createChat(toUser.asOk().value, fromUser.asOk().value);

            if (secondResult.isErr()) return new Result.Err(secondResult.asErr().error);
            chat = secondResult.asOk().value;
        } else {
            chat = chatResult.asOk().value.unwrap()!;
        }

        const createResult = (await this._messageRepository.createMessage(chat, content, sentAt)).unwrap();

        return new Result.Ok(createResult);
    }

    private async ensureUser(userId: string): Promise<Result<User, Error>> {
        const userResult = (await this._userRepository.getUser(userId));
        if (userResult.isErr()) return new Result.Err(userResult.asErr().error);
        const user = userResult.asOk().value;

        if (user.isSome()) return new Result.Ok(user.value);

        return await this._userRepository.createUser(userId);
    }
}
