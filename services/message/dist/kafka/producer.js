var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { injectable, inject } from "inversify";
import { KafkaConnection } from "./connection";
let KafkaProducer = class KafkaProducer {
    _conn;
    _producer;
    constructor(_conn) {
        this._conn = _conn;
    }
    async getProducer() {
        if (!this._producer)
            await this.loadProducer();
        return this._producer;
    }
    async loadProducer() {
        const kafka = await this._conn.getConnection();
        this._producer = kafka.producer();
        console.log("Producer connect start");
        await this._producer.connect();
        console.log("Producer connect success");
    }
    async disconnect() {
        if (!this._producer)
            return;
        await this._producer.disconnect();
    }
};
KafkaProducer = __decorate([
    injectable(),
    __param(0, inject(KafkaConnection))
], KafkaProducer);
export { KafkaProducer };
