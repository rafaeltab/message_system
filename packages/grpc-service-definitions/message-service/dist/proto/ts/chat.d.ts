import type { MessageTypeDefinition } from '@grpc/proto-loader';
export interface ProtoGrpcType {
    com: {
        message: {
            v1: {
                Chat: MessageTypeDefinition;
                User: MessageTypeDefinition;
            };
        };
    };
}
