import { Container } from "inversify";
import { GetMessageHandler } from "./rpc_handlers/get_message";
import { SendMessageHandler } from "./rpc_handlers/send_message";
import { KafkaConfiguration } from "./kafka/config";
import { KafkaConnection } from "./kafka/connection";
import { KafkaProducer } from "./kafka/producer";
import { KafkaConsumer } from "./kafka/consumer";
import { SendMessageKafkaHandler } from "./kafka_handlers/send_message";
import { SendMessageTopic } from "./kafka/topics/send_message";
import { KafkaAdmin } from "./kafka/admin";
import { MessageParser, strategies } from "kafka-messages";
import { PostgressConnection } from "./db/postgres";
import { UserRepository } from "./infrastructure/repositories/user_repository";
import { IUserRepository } from "./domain/repository/user_repository";
import { IMessageRepository } from "./domain/repository/message_repository";
import { MessageRepository } from "./infrastructure/repositories/message_repository";
import { IChatRepository } from "./domain/repository/chat_repository";
import { ChatRepository } from "./infrastructure/repositories/chat_repository";
import { MessageFactory } from "./domain/factories/message_factory";

const container = new Container();
container.bind<GetMessageHandler>(GetMessageHandler).to(GetMessageHandler);
container.bind<SendMessageHandler>(SendMessageHandler).to(SendMessageHandler);

container.bind(KafkaConfiguration).to(KafkaConfiguration).inSingletonScope();
container.bind(KafkaConnection).to(KafkaConnection).inSingletonScope();
container.bind(KafkaProducer).to(KafkaProducer).inSingletonScope();
container.bind(KafkaConsumer).to(KafkaConsumer).inSingletonScope();
container.bind(KafkaAdmin).to(KafkaAdmin).inSingletonScope();
container.bind(PostgressConnection).to(PostgressConnection).inSingletonScope();

container.bind(SendMessageTopic).to(SendMessageTopic);
container.bind(SendMessageKafkaHandler).to(SendMessageKafkaHandler);

container.bind(IUserRepository).to(UserRepository);
container.bind(IMessageRepository).to(MessageRepository);
container.bind(IChatRepository).to(ChatRepository);

container.bind(MessageFactory).to(MessageFactory);

var parser = new MessageParser(strategies.map(x => new x()));
await parser.compile();

container.bind(MessageParser).toConstantValue(parser);

export { container };
