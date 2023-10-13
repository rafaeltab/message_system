import { injectable, inject } from "inversify";
import { KafkaConnection } from "./connection";
import { Producer } from "kafkajs";

@injectable()
export class KafkaProducer {
    private _producer?: Producer;

    constructor(@inject(KafkaConnection) private _conn: KafkaConnection) { }

    public async getProducer(): Promise<Producer> {
        if (!this._producer) await this.loadProducer();
        return this._producer!;
    }

    private async loadProducer() {
        const kafka = await this._conn.getConnection();
        this._producer = kafka.producer();
        console.log("Producer connect start");
        await this._producer.connect();
        console.log("Producer connect success");
    }

    private async disconnect() {
        if(!this._producer) return;
        await this._producer.disconnect();
    }
}
