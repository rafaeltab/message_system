import { injectable, inject } from "inversify";
import {Kafka} from "kafkajs";
import { KafkaConfiguration } from "./config";

@injectable()
export class KafkaConnection {
    private _kafka?: Kafka;
    constructor(@inject(KafkaConfiguration) private _config: KafkaConfiguration) {}

    public async getConnection(): Promise<Kafka> {
        if(!this._kafka) await this.loadConnection();
        return this._kafka!;
    }
    private async loadConnection() {
        this._kafka = new Kafka(await this._config.getConfig());
    }
}

