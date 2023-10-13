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
let KafkaConsumer = class KafkaConsumer {
    _conn;
    _consumers;
    constructor(_conn) {
        this._conn = _conn;
        this._consumers = new Map();
    }
    async getConsumer(groupId) {
        if (!this._consumers.has(groupId))
            await this.loadConsumer(groupId);
        return this._consumers.get(groupId);
    }
    async loadConsumer(groupId) {
        const kafka = await this._conn.getConnection();
        const consumer = kafka.consumer({
            groupId
        });
        console.log("Consumer connect start");
        await consumer.connect();
        console.log("Consumer connect success");
        this._consumers.set(groupId, consumer);
    }
};
KafkaConsumer = __decorate([
    injectable(),
    __param(0, inject(KafkaConnection))
], KafkaConsumer);
export { KafkaConsumer };
