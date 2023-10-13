import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type { GetMessagesRequest as _services_message_v1_GetMessagesRequest, GetMessagesRequest__Output as _services_message_v1_GetMessagesRequest__Output } from '../../../services/message/v1/GetMessagesRequest';
import type { GetMessagesResponse as _services_message_v1_GetMessagesResponse, GetMessagesResponse__Output as _services_message_v1_GetMessagesResponse__Output } from '../../../services/message/v1/GetMessagesResponse';
import type { SendMessageRequest as _services_message_v1_SendMessageRequest, SendMessageRequest__Output as _services_message_v1_SendMessageRequest__Output } from '../../../services/message/v1/SendMessageRequest';
import type { SendMessageResponse as _services_message_v1_SendMessageResponse, SendMessageResponse__Output as _services_message_v1_SendMessageResponse__Output } from '../../../services/message/v1/SendMessageResponse';
export interface MessageServiceClient extends grpc.Client {
    GetMessages(argument: _services_message_v1_GetMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    GetMessages(argument: _services_message_v1_GetMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    GetMessages(argument: _services_message_v1_GetMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    GetMessages(argument: _services_message_v1_GetMessagesRequest, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    getMessages(argument: _services_message_v1_GetMessagesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    getMessages(argument: _services_message_v1_GetMessagesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    getMessages(argument: _services_message_v1_GetMessagesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    getMessages(argument: _services_message_v1_GetMessagesRequest, callback: grpc.requestCallback<_services_message_v1_GetMessagesResponse__Output>): grpc.ClientUnaryCall;
    SendMessage(argument: _services_message_v1_SendMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    SendMessage(argument: _services_message_v1_SendMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    SendMessage(argument: _services_message_v1_SendMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    SendMessage(argument: _services_message_v1_SendMessageRequest, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    sendMessage(argument: _services_message_v1_SendMessageRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    sendMessage(argument: _services_message_v1_SendMessageRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    sendMessage(argument: _services_message_v1_SendMessageRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
    sendMessage(argument: _services_message_v1_SendMessageRequest, callback: grpc.requestCallback<_services_message_v1_SendMessageResponse__Output>): grpc.ClientUnaryCall;
}
export interface MessageServiceHandlers extends grpc.UntypedServiceImplementation {
    GetMessages: grpc.handleUnaryCall<_services_message_v1_GetMessagesRequest__Output, _services_message_v1_GetMessagesResponse>;
    SendMessage: grpc.handleUnaryCall<_services_message_v1_SendMessageRequest__Output, _services_message_v1_SendMessageResponse>;
}
export interface MessageServiceDefinition extends grpc.ServiceDefinition {
    GetMessages: MethodDefinition<_services_message_v1_GetMessagesRequest, _services_message_v1_GetMessagesResponse, _services_message_v1_GetMessagesRequest__Output, _services_message_v1_GetMessagesResponse__Output>;
    SendMessage: MethodDefinition<_services_message_v1_SendMessageRequest, _services_message_v1_SendMessageResponse, _services_message_v1_SendMessageRequest__Output, _services_message_v1_SendMessageResponse__Output>;
}
