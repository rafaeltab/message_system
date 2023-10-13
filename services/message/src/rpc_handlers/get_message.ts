import { ServerErrorResponse, StatusObject } from "@grpc/grpc-js";
import { GetMessagesRequest__Output } from "message-service-grpc/dist/proto/ts/services/message/v1/GetMessagesRequest";
import { GetMessagesResponse__Output } from "message-service-grpc/dist/proto/ts/services/message/v1/GetMessagesResponse";
import { MessageHandler } from "./message_handler";
import { injectable } from "inversify"; 

@injectable()
export class GetMessageHandler extends MessageHandler<GetMessagesRequest__Output, GetMessagesResponse__Output> {
    constructor() {
        super();
    }

    protected async handle(req: GetMessagesRequest__Output):
        Promise<[Partial<StatusObject> | ServerErrorResponse, null] | [null, GetMessagesResponse__Output]> {
        return [null, {
            data: [{
                sentAt: Date.now().toString(),
                content: "Here's johny!"
            }],
            count: req.pageSize,
            total: req.pageSize,
            pageNext: req.pageStart
        }];
    }
}

