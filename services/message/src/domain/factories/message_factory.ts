import { IUserRepository } from "../repository/user_repository";
import { IMessageRepository } from "../repository/message_repository";
import { IChatRepository } from "../repository/chat_repository";
import { Message } from "../aggregates/message";
import { Result } from "utils";
import { inject, injectable } from "inversify";

@injectable()
export class MessageFactory {
    constructor(
        @inject(IUserRepository) private _userRepository: IUserRepository,
        @inject(IChatRepository) private _chatRepository: IChatRepository,
        @inject(IMessageRepository) private _messageRepository: IMessageRepository
    ) {

    }

    async createMessage(toUserId: bigint, fromUserId: bigint, content: string, sentAt: string): Promise<Result<Message, Error>> {
        var toUserPromise = this._userRepository.getUser(toUserId);
        var fromUserPromise = this._userRepository.getUser(fromUserId);
        var toUser = await toUserPromise;
        var fromUser = await fromUserPromise;

        if (toUser.isErr()) return new Result.Err(toUser.error);
        if (fromUser.isErr()) return new Result.Err(fromUser.error);

        if (toUser.asOk().value.isNone()) return new Result.Err(Error("toUser not found"));
        if (fromUser.asOk().value.isNone()) return new Result.Err(Error("fromUser not found"));

        const toUserEntity = toUser.asOk().value.asSome().value;
        const fromUserEntity = fromUser.asOk().value.asSome().value;

        var chatResult = (await this._chatRepository.getChat([toUserEntity, fromUserEntity]));

        if (chatResult.isErr()) return new Result.Err(chatResult.error);
        if (chatResult.asOk().value.isNone()) return new Result.Err(Error("chat not found"));

        const chat = chatResult.asOk().value.unwrap()!;

        const createResult = await this._messageRepository.createMessage(chat, content, sentAt, fromUserEntity);
        if(createResult.isErr()) return new Result.Err(createResult.error);

        return new Result.Ok(createResult.asOk().value);
    }
}
