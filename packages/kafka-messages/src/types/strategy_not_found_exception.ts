export class StrategyNotFoundException implements Error {
    name: string = "StrategyNotFound";
    message: string;
    constructor(type: string){
        this.message = `The type '${type}' in a message did not match any strategies`;
    }
}
