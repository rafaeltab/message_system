export class InvalidFormatException implements Error {
    name: string = "InvalidFormatException";
    message: string = "A kafka message was parsed with an incorrect format";
}
