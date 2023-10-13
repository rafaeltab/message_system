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

const container = new Container();
container.bind<GetMessageHandler>(GetMessageHandler).to(GetMessageHandler);
container.bind<SendMessageHandler>(SendMessageHandler).to(SendMessageHandler);

container.bind(KafkaConfiguration).to(KafkaConfiguration).inSingletonScope();
container.bind(KafkaConnection).to(KafkaConnection).inSingletonScope();
container.bind(KafkaProducer).to(KafkaProducer).inSingletonScope();
container.bind(KafkaConsumer).to(KafkaConsumer).inSingletonScope();
container.bind(KafkaAdmin).to(KafkaAdmin).inSingletonScope();

container.bind(SendMessageTopic).to(SendMessageTopic);
container.bind(SendMessageKafkaHandler).to(SendMessageKafkaHandler);

var parser = new MessageParser(strategies.map(x => new x()));
await parser.compile();

container.bind(MessageParser).toConstantValue(parser);

export { container };
