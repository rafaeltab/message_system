import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { ServerErrorResponse, ServerStatusResponse } from "@grpc/grpc-js/build/src/server-call";
import { injectable } from "inversify";

@injectable()
export abstract class MessageHandler<TRequest, TResponse> {
    protected abstract handle(req: TRequest, call: ServerUnaryCall<TRequest, TResponse>):
        Promise<[null, TResponse] | [ServerErrorResponse | ServerStatusResponse, null]>;

    public async handleMessage(req: ServerUnaryCall<TRequest, TResponse>, res: sendUnaryData<TResponse>) {
        var result = await this.handle(req.request, req);
        res(result[0], result[1]);
    }
}
