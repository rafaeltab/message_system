import { expect, it, describe } from "vitest";
import { SendMessageRequestedMessageModel, SendMessageRequestedStrategy,  } from "./send_message_requested";
import Ajv from "ajv";
import addFormats from "ajv-formats";

describe("SendMessageRequestedStrategy.validate", async () => {
    const sut = new SendMessageRequestedStrategy();
    const ajv = new Ajv();
    addFormats(ajv)
    await sut.compile(ajv);

    it("Should return true if a valid message is passed into the method", () => {
        var given: SendMessageRequestedMessageModel = {
            type: "SendMessageRequested",
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
        }

        const result = sut.validate(given);

        expect(result).toEqual(false)
    });
});
