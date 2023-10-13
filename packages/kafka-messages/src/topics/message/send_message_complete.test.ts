import { expect, it, describe } from "vitest";
import { SendMessageCompletedMessageModel, SendMessageCompleteStrategy } from "./send_message_complete";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("SendMessageCompleteStrategy.validate", async () => {
    const sut = new SendMessageCompleteStrategy();
    const ajv = new Ajv();
    addFormats(ajv)
    await sut.compile(ajv);

    it("Should return true if a valid message is passed into the method", () => {
        var given: SendMessageCompletedMessageModel = {
            type: "SendMessageCompleted",
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

        expect(result).toEqual(true);
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
            created_at: Date().toString()
        }

        const result = sut.validate(given);

        expect(result).toEqual(false)
    });
});
