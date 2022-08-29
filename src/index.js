import express from "express";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import { createConnection, registerSchemas } from "./db/helpers/index.js";
import { RoomRouter } from "./routes/index.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

createConnection(mongoose)
  .then(() => registerSchemas(mongoose))
  .then(() => startApp());

function startApp() {
  app.use(cors());
  app.use(express.json());
  app.use("/room", RoomRouter);

  const game = {
    players: [],
    choseElements: [],
  };

  function getWinner() {
    const { choseElements } = game;
    const [element1, element2] = choseElements;

    if (element1.element === element2.element) {
      return "both";
    }

    if (
      (element1.element === "rock" && element2.element === "scissors") ||
      (element1.element === "scissors" && element2.element === "paper") ||
      (element1.element === "paper" && element2.element === "rock")
    ) {
      return element1.userId;
    }

    return element2.userId;
  }

  app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>");
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("userConnectedToTheRoom", ({ user, roomId }) => {
      if (game.players.length === 2) {
        game.players = [];
      }

      socket.join(roomId);

      game.players.push(user);

      io.to(roomId).emit("gamePlayers", { players: [...game.players] });
    });

    socket.on("elementChose", ({ roomId, ...args }) => {
      game.choseElements.push(args);

      if (game.choseElements.length === 2) {
        const result = getWinner();

        io.to(roomId).emit("gameResult", { winner: result });

        game.choseElements = [];
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  server.listen(3000, () => {
    console.log("listening on *:3000");
  });
}
