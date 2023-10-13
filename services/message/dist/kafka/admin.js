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
let KafkaAdmin = class KafkaAdmin {
    _conn;
    _admin;
    constructor(_conn) {
        this._conn = _conn;
    }
    async getAdmin() {
        if (!this._admin)
            await this.loadAdmin();
        return this._admin;
    }
    async loadAdmin() {
        const kafka = await this._conn.getConnection();
        this._admin = kafka.admin();
        console.log("Admin connect start");
        await this._admin.connect();
        console.log("Admin connect success");
    }
    async disconnect() {
        if (!this._admin)
            return;
        await this._admin.disconnect();
    }
};
KafkaAdmin = __decorate([
    injectable(),
    __param(0, inject(KafkaConnection))
], KafkaAdmin);
export { KafkaAdmin };
