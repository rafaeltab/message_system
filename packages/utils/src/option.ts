export class Option<A> {
    isSome(): this is Option.Some<A> {
        return this instanceof Option.Some;
    }
    
    isNone(): this is Option.None<A> {
        return this instanceof Option.None;
    }
    
    asSome(): Option.Some<A> {
        if(this.isNone()) throw Error("asSome was called on None");
        return this as unknown as Option.Some<A>;
    }

    asNone(): Option.None<A> {
        if(this.isSome()) throw Error("asNone was called on Some");
        return this as unknown as Option.None<A>;
    }

    unwrap(): A | null {
        if (this.isSome()) {
            return (this as Option.Some<A>).value;
        }
        return null;
    }
}

export namespace Option {
    export class None<B> extends Option<B> {
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
