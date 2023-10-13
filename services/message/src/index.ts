import "reflect-metadata";
import { getProtoFiles } from "message-service-grpc/dist/src/index";
import { Server, ServerCredentials } from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { ProtoGrpcType } from "message-service-grpc/dist/proto/ts/message_service";
import { MessageServiceHandlers } from "message-service-grpc/dist/proto/ts/services/message/v1/MessageService";
import { SendMessageHandler } from "./rpc_handlers/send_message";
import { GetMessageHandler } from "./rpc_handlers/get_message";
import { container } from "./inversify.config";
import { SendMessageTopic } from "./kafka/topics/send_message";
import { SendMessageKafkaHandler } from "./kafka_handlers/send_message";

const PORT = 4000;
const PROTO_FILES = await getProtoFiles();

const packageDef = await protoLoader.load(PROTO_FILES, {});
const grpcObj = loadPackageDefinition(packageDef) as unknown as ProtoGrpcType;

const server = new Server();
await container.get(SendMessageTopic).ensureCreated();

var messageHandler = container.get(SendMessageKafkaHandler);
await messageHandler.startListening();

server.bindAsync(`0.0.0.0:${PORT}`, ServerCredentials.createInsecure(), () => {
    server.start();

    console.log(`server is running on 0.0.0.0: ${PORT}`);
});

server.addService(grpcObj.services.message.v1.MessageService.service, {
    GetMessages: (req, res) => {container.get(GetMessageHandler).handleMessage(req, res)},
    SendMessage: (req, res) => {container.get(SendMessageHandler).handleMessage(req, res)},
} satisfies MessageServiceHandlers);

