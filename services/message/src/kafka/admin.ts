import { injectable, inject } from "inversify";
import { KafkaConnection } from "./connection";
import { Admin } from "kafkajs";

@injectable()
export class KafkaAdmin {
    private _admin?: Admin;

    constructor(@inject(KafkaConnection) private _conn: KafkaConnection) { }

    public async getAdmin(): Promise<Admin> {
        if (!this._admin) await this.loadAdmin();
        return this._admin!;
    }

    private async loadAdmin() {
        const kafka = await this._conn.getConnection();
        this._admin = kafka.admin();
        console.log("Admin connect start");
        await this._admin.connect();
        console.log("Admin connect success");
    }

    private async disconnect() {
        if(!this._admin) return;
        await this._admin.disconnect();
    }
}
