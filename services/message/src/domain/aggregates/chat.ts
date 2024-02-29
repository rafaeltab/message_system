import { User } from "./user";

export class Chat {
    constructor(public id: bigint, public userA: User, public userB: User) { }
}
