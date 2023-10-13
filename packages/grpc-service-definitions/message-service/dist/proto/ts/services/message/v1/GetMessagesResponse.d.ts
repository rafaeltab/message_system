import type { Message as _com_message_v1_Message, Message__Output as _com_message_v1_Message__Output } from '../../../com/message/v1/Message';
export interface GetMessagesResponse {
    'pageNext'?: (string);
    'count'?: (number);
    'total'?: (number);
    'data'?: (_com_message_v1_Message)[];
}
export interface GetMessagesResponse__Output {
    'pageNext': (string);
    'count': (number);
    'total': (number);
    'data': (_com_message_v1_Message__Output)[];
}
