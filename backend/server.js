import express from "express";
import http from "http";
import { server as WebSocketServer } from "websocket";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "../frontend")));

const wsServer = new WebSocketServer({ httpServer: server });
const clients = [];


wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);
  clients.push(connection);
  console.log("Client connected");

  connection.on("message", (message) => {
    if (message.type === "utf8") {
      console.log("Received:", message.utf8Data);

      clients.forEach((client) => {
        if (client.connected) {
          client.sendUTF(message.utf8Data);
        }
      });
    }
  });

  connection.on("close", () => {
    console.log("Client disconnected");
    const index = clients.indexOf(connection);
    if (index !== -1) clients.splice(index, 1);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
