import { ServerWebSocket } from "bun";
import { v4 } from "uuid";

const socketMap = new Map<string, ServerWebSocket<unknown>>();
const idMap = new WeakMap<ServerWebSocket<unknown>, string>();

const server = Bun.serve({
  port: 3000,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) {
      // Bun automatically returns a 101 Switching Protocols
      // if the upgrade succeeds
      return undefined;
    }

    // handle HTTP request normally
    return new Response("Hello world!");
  },
  websocket: {
    async open(ws) {
      const id = v4();
      ws.send(JSON.stringify({
        clientId: id
      }));
      socketMap.set(id, ws);
      idMap.set(ws, id);
    },
    async message(ws, message) {
      const id = idMap.get(ws);
      console.log(`${id} said ${message}`);
      // send back a message
      ws.send(`You said: ${message} and you are ${id}`);
    },
    async close(ws) {
      const id = idMap.get(ws);
      if(!id) return;
      ws.send(`Goodbye ${id}!`);
      idMap.delete(ws);
      socketMap.delete(id);
    }
  }
});

setInterval(() => {
  for (let client of socketMap) {
    client[1].send(`We're still connected! ${client[0]}`);
    console.log(`We're still connected! ${client[0]}`)
  }
}, 1000);

console.log(`Listening on http://localhost:${server.port} ...`);
