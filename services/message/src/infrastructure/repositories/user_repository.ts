import { Option, Result } from "utils";
import { PostgressConnection } from "../../db/postgres";
import { User } from "../../domain/aggregates/user";
import { IUserRepository } from "../../domain/repository/user_repository";

export class UserRepository extends IUserRepository {
    constructor(private postConn: PostgressConnection) {
        super();
    }

    async createUser(userId: string): Promise<Result<User, Error>> {
        const existing = await this.getUser(userId);

        if (existing.isErr()) return new Result.Err(existing.asErr().error);

        if (existing.asOk().value.isSome()) return new Result.Ok(existing.asOk().value.asSome().value);

        const newUser = await this.postConn.sql`
            INSERT INTO users (id) VALUES (${userId});
        `;

        const parsed = parseUser(newUser[0]);
        if (parsed.isErr()) return new Result.Err(parsed.asErr().error);

        return new Result.Ok(parsed.asOk().value);
    }

    async getUser(userId: string): Promise<Result<Option<User>, Error>> {
        const existing = await this.postConn.sql`
            SELECT * FROM users WHERE id == ${userId};
        `;

        if (existing.length == 0) return new Result.Ok(new Option.None());

        const parsed = parseUser(existing[0]);
        if (parsed.isErr()) return new Result.Err(parsed.asErr().error);

        return new Result.Ok(new Option.Some(parsed.asOk().value));
    }
}

function parseUser(entity: unknown): Result<User, Error> {
    if (!(typeof entity == "object" &&
        entity !== null &&
        "id" in entity &&
        typeof entity.id == "number")) return new Result.Err(Error());

    return new Result.Ok(new User(entity.id));
}
