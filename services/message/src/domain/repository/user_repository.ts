import { Result, Option } from "utils";
import { User } from "../aggregates/user";
import { injectable } from "inversify";

@injectable()
export abstract class IUserRepository {
    abstract createUser(userId: bigint): Promise<Result<User, Error>>;
    abstract getUser(userId: bigint): Promise<Result<Option<User>, Error>>;
}
