// Original file: proto/com/message/v1/chat.proto

import type { User as _com_message_v1_User, User__Output as _com_message_v1_User__Output } from '../../../com/message/v1/User';

export interface Chat {
  'fromUser'?: (_com_message_v1_User | null);
  'toUser'?: (_com_message_v1_User | null);
}

export interface Chat__Output {
  'fromUser': (_com_message_v1_User__Output | null);
  'toUser': (_com_message_v1_User__Output | null);
}
