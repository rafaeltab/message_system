export class StrategyNotFoundException {
    name = "StrategyNotFound";
    message;
    constructor(type) {
        this.message = `The type '${type}' in a message did not match any strategies`;
    }
}
