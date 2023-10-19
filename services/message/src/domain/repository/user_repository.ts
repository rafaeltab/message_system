import { Result, Option } from "utils";
import { User } from "../aggregates/user";

export abstract class IUserRepository {
    abstract createUser(userId: string): Promise<Result<User, Error>>;
    abstract getUser(userId: string): Promise<Result<Option<User>, Error>>;
}
