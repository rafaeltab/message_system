import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { GetMessagesRequest, GetMessagesResponse } from "../proto/build/nodejs/services/message/v1/message_service_pb";

export const getMessageService = (
    call: ServerUnaryCall<GetMessagesRequest, GetMessagesResponse>,
    callback: sendUnaryData<GetMessagesResponse>
) => {
    const response = new GetMessagesResponse();
    response.setTotal(0);
    response.setCount(0);
    response.setDataList([]);
    response.setPageNext("unknown");
    callback(null, response);
}
