var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Topic_1;
import { injectable } from "inversify";
let Topic = class Topic {
    static { Topic_1 = this; }
    _producer;
    _admin;
    static topics;
    constructor(_producer, _admin) {
        this._producer = _producer;
        this._admin = _admin;
    }
    async ensureCreated() {
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
        if (Topic_1.topics.has(topic))
            return;
        throw new Error("Topic does not exist, please create it " + this.getTopic());
    }
    async loadTopics() {
        if (Topic_1.topics !== undefined)
            return;
        console.log("Loading topics");
        const admin = await this._admin.getAdmin();
        Topic_1.topics = new Set(await admin.listTopics());
        console.log("Loading topics succeeded");
    }
    async send(...messages) {
        const producer = await this._producer.getProducer();
        producer.send({
            topic: this.getTopic(),
            messages: messages.map(Topic_1.mapMessage)
        });
    }
    static mapMessage(msg) {
        if (typeof msg == "string")
            return msg;
        if (msg instanceof Buffer)
            return msg;
        if (msg === null)
            return msg;
        return {
            ...msg,
            value: JSON.stringify(msg.value)
        };
    }
};
Topic = Topic_1 = __decorate([
    injectable()
], Topic);
export { Topic };
