import { Server, ServerCredentials } from "@grpc/grpc-js";
import { getMessageService } from "./get_message_service.ts";
import { sendMessageService } from "./send_message_service.ts";
import {MessageServiceService} from "../proto/build/nodejs/services/message/v1/message_service_grpc_pb";

const server = new Server();

server.bindAsync('0.0.0.0:4000', ServerCredentials.createInsecure(), () => {
    server.start();

    console.log('server is running on 0.0.0.0:4000');
});
server.addService(MessageServiceService, {getMessageService, sendMessageService });
