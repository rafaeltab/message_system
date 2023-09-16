import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { SendMessageRequest, SendMessageResponse } from "../proto/build/nodejs/services/message/v1/message_service_pb";
import { Message } from "../proto/build/nodejs/com/message/v1/message_pb";

export const sendMessageService = (
    call: ServerUnaryCall<SendMessageRequest, SendMessageResponse>,
    callback: sendUnaryData<SendMessageResponse>
) => {
    const response = new SendMessageResponse();
    const message = new Message();
    message.setSentAt(Date.now());
    message.setContent("Potato");
    response.setMsg(message);
    callback(null, response);
}

