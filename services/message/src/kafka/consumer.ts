import { injectable, inject } from "inversify";
import { KafkaConnection } from "./connection";
import { Consumer } from "kafkajs";

@injectable()
export class KafkaConsumer {
    private _consumers: Map<string, Consumer>;

    constructor(@inject(KafkaConnection) private _conn: KafkaConnection) {
        this._consumers = new Map();
    }

    public async getConsumer(groupId: string): Promise<Consumer> {
        if (!this._consumers.has(groupId)) await this.loadConsumer(groupId);
        return this._consumers.get(groupId)!;
    }

    private async loadConsumer(groupId: string) {
        const kafka = await this._conn.getConnection();
        const consumer = kafka.consumer({
            groupId
        });
        console.log("Consumer connect start");
        await consumer.connect();
        console.log("Consumer connect success");
        this._consumers.set(groupId, consumer );
    }
}
