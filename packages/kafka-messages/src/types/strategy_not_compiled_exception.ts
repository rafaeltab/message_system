export class StrategyNotCompiledException implements Error {
    name: string = "StrategyNotCompiled";
    message: string = "The strategy was not compiled when it was thrown";
}
