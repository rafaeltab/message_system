// Original file: proto/services/message/v1/message_service.proto

import type { Chat as _com_message_v1_Chat, Chat__Output as _com_message_v1_Chat__Output } from '../../../com/message/v1/Chat';

export interface GetMessagesRequest {
  'pageStart'?: (string);
  'pageSize'?: (number);
  'chat'?: (_com_message_v1_Chat | null);
}

export interface GetMessagesRequest__Output {
  'pageStart': (string);
  'pageSize': (number);
  'chat': (_com_message_v1_Chat__Output | null);
}
