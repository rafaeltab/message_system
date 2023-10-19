export class Result<TResult, TError> {
    unwrap(): TResult {
        if (this instanceof Result.Err) {
            throw (this as Result.Err<TResult, TError>).error;
        }

        if (this instanceof Result.Ok) {
            return (this as Result.Ok<TResult, TError>).value;
        }

        throw new Error("Do not extends Result<TResult, TError>");
    }

    isOk(): this is Result.Ok<TResult, TError> {
        return this instanceof Result.Ok;
    }
    
    isErr(): this is Result.Err<TError, TError> {
        return this instanceof Result.Err;
    }

    asOk(): Result.Ok<TResult, TError> {
        if(this.isErr()) throw this.asErr().error;
        return this as unknown as Result.Ok<TResult, TError>;
    }

    asErr(): Result.Err<TResult, TError> {
        return this as unknown as Result.Err<TResult, TError>;
    }
}

export namespace Result {
    export class Err<TResult, TError> extends Result<TResult, TError> {
        constructor(public error: TError) {
            super();
        }
    }
    export class Ok<TResult, TError> extends Result<TResult, TError> {
        constructor(public value: TResult) {
            super();
        }
    }
}
