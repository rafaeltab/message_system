import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { MessageServiceClient as _services_message_v1_MessageServiceClient, MessageServiceDefinition as _services_message_v1_MessageServiceDefinition } from './services/message/v1/MessageService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  com: {
    message: {
      v1: {
        Chat: MessageTypeDefinition
        Message: MessageTypeDefinition
        User: MessageTypeDefinition
      }
    }
  }
  services: {
    message: {
      v1: {
        GetMessagesRequest: MessageTypeDefinition
        GetMessagesResponse: MessageTypeDefinition
        MessageService: SubtypeConstructor<typeof grpc.Client, _services_message_v1_MessageServiceClient> & { service: _services_message_v1_MessageServiceDefinition }
        SendMessageRequest: MessageTypeDefinition
        SendMessageResponse: MessageTypeDefinition
      }
    }
  }
}

