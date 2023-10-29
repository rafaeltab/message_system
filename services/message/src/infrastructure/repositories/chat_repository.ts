import { Result, Option } from "utils";
import { Chat } from "../../domain/aggregates/chat";
import { User } from "../../domain/aggregates/user";
import { IChatRepository } from "../../domain/repository/chat_repository";
import { PostgressConnection } from "../../db/postgres";
import postgres from "postgres";

export class ChatRepository extends IChatRepository {
    constructor(private postConn: PostgressConnection) {
        super();
    }

    async createChat(userA: User, userB: User): Promise<Result<Chat, Error>> {
        const existing = await this.getChat([userA, userB]);
        if (existing.isErr()) return new Result.Err(existing.asErr().error);
        if (existing.asOk().value.isSome()) return new Result.Ok(existing.asOk().value.asSome().value);

        const newEntry = await this.postConn.sql`
            INSERT INTO chat (user_a, user_b) VALUES (${userA.id}, ${userB.id}) RETURNING *;
        `;

        return parseFromRow(newEntry[0], userA, userB);
    }

    async getChat(users: [User, User]): Promise<Result<Option<Chat>, Error>> {
        const userA = users[0];
        const userB = users[0];
        const exists = await this.postConn.sql`
            SELECT * FROM chat WHERE (user_a == ${userA.id} AND user_b == ${userB.id}) OR (user_a == ${userB.id} AND user_b == ${userA.id});
        `;

        if (exists.length == 0) {
            return new Result.Ok(new Option.None());
        }

        var parsed = parseFromRow(exists[0], userA, userB);

        if (parsed.isErr()) return new Result.Err(parsed.asErr().error);

        return new Result.Ok(new Option.Some(parsed.asOk().value));
    }
}

function parseFromRow(row: unknown, userA: User, userB: User): Result<Chat, Error> {
    if (typeof row !== "object" || row == null) return new Result.Err(Error());
    if (!("user_a" in row && "user_b" in row && "id" in row && typeof row.user_a == "number" && typeof row.user_b == "number" && typeof row.id == "number")) {
        return new Result.Err(Error());
    }
    if (row.user_a == userA.id) {
        return new Result.Ok(new Chat(row.id, userA, userB));
    }
    if (row.user_a == userB.id) {
        return new Result.Ok(new Chat(row.id, userB, userA));
    }
    return new Result.Err(Error());
}
