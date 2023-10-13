// Original file: proto/services/message/v1/message_service.proto

import type { Chat as _com_message_v1_Chat, Chat__Output as _com_message_v1_Chat__Output } from '../../../com/message/v1/Chat';

export interface SendMessageRequest {
  'chat'?: (_com_message_v1_Chat | null);
  'content'?: (string);
}

export interface SendMessageRequest__Output {
  'chat': (_com_message_v1_Chat__Output | null);
  'content': (string);
}
