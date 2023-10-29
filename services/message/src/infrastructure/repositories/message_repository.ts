import { Result } from "utils";
import { PostgressConnection } from "../../db/postgres";
import { Chat } from "../../domain/aggregates/chat";
import { Message } from "../../domain/aggregates/message";
import { IMessageRepository } from "../../domain/repository/message_repository";
import { User } from "../../domain/aggregates/user";

export class MessageRepository extends IMessageRepository {
    constructor(private postConn: PostgressConnection) {
        super();
    }

    async createMessage(chat: Chat, content: string, sentAt: string, fromUser: User): Promise<Result<Message, Error>> {
        const inserted = await this.postConn.sql`
            INSERT INTO messages (chat, content, from_user, created_at) VALUES (${chat.id}, ${content}, ${fromUser.id}, ${sentAt}) RETURNING *;
        `;

        if (inserted.length == 0) {
            return new Result.Err(Error());
        }
        const entity: unknown = inserted[0];

        if (!(typeof entity == "object" &&
            entity !== null &&
            "id" in entity &&
            typeof entity.id == "number" &&
            "content" in entity &&
            typeof entity.content == "string" &&
            "chat" in entity &&
            typeof entity.chat == "string" &&
            "created_at" in entity &&
            typeof entity.created_at == "string")) {
            return new Result.Err(Error());
        }

        return new Result.Ok(new Message(entity.id, chat, fromUser, entity.content, entity.created_at));
    }
}
