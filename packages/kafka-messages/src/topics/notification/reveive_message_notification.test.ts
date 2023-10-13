import { expect, it, describe } from "vitest";
import { ReceiveMessageNotificationModel, ReceiveMessageStrategy } from "./receive_message_notification";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("ReceiveMessageStrategy.validate", async () => {
    const sut = new ReceiveMessageStrategy();
    const ajv = new Ajv();
    addFormats(ajv)
    await sut.compile(ajv);

    it("Should return true if a valid message is passed into the method", () => {
        var given: ReceiveMessageNotificationModel = {
            user_id: "marie",
            type: "ReveiveMessage",
            chat: {
                from_user: {
                    user_id: "john"    
                },
            },
            content: "Johns farm",
            created_at: (new Date()).toISOString()
        }

        const result = sut.validate(given);

        expect(result).toEqual(true)
    });

    it("Should return false if an invalid message is passed into the method", () => {
        var given = {
            chat: {
                from_user: {
                    user_id: "john"    
                },
                to_user: {
                    user_id: "marie"    
                }
            },
            content: "Johns farm",
            created_at: (new Date()).toISOString()
        }

        const result = sut.validate(given);

        expect(result).toEqual(false)
    });
});
