export class Option<A> {
    isSome(): this is Option.Some<A> {
        return this instanceof Option.Some;
    }
    
    isNone(): this is Option.None {
        return this instanceof Option.None;
    }

    unwrap(): A | null {
        if (this.isSome()) {
            return (this as Option.Some<A>).value;
        }
        return null;
    }
}

export namespace Option {
    export class None extends Option<unknown> {
        constructor() {
            super();
        }
    }
    export class Some<B> extends Option<B> {
        constructor(public value: B) {
            super();
        }
    }
}
