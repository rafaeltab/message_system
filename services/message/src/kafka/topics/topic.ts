import { Message } from "kafkajs";
import { KafkaAdmin } from "../admin";
import { KafkaProducer } from "../producer";
import { injectable } from "inversify";

@injectable()
export abstract class Topic {
    static topics?: Set<string>;
    constructor(private _producer: KafkaProducer, private _admin: KafkaAdmin) {

    }

    abstract getTopic(): string;
    async ensureCreated(): Promise<void> {
        const topic = this.getTopic();
        // const admin = await this._admin.getAdmin();
        // admin.createTopics({
        //     topics: [
        //         {
        //             topic
        //         }
        //     ]
        // })
        await this.loadTopics();
        if (Topic.topics!.has(topic)) return;

        throw new Error("Topic does not exist, please create it " + this.getTopic());
    }
    private async loadTopics() {
        if (Topic.topics !== undefined) return;
        console.log("Loading topics")
        const admin = await this._admin.getAdmin();
        Topic.topics = new Set(await admin.listTopics());
        console.log("Loading topics succeeded")
    }

    async send(...messages: KafkaMessage[]) {
        const producer = await this._producer.getProducer();
        producer.send({
            topic: this.getTopic(),
            messages: messages.map(Topic.mapMessage)
        })
    }


    private static mapMessage(msg: KafkaMessage): Message {
        if (typeof msg == "string") return msg as Message;
        if (msg instanceof Buffer) return msg as Message;
        if (msg === null) return msg as Message;

        return {
            ...msg,
            value: JSON.stringify(msg.value)
        }
    }
}

type KafkaMessage = Message | {
    value: unknown
}
