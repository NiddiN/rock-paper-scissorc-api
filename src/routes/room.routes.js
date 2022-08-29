import express from "express";
import mongoose from "mongoose";

export const RoomRouter = express.Router();

RoomRouter.get("/", async (_, res) => {
  const roomModel = mongoose.models.room;

  try {
    const rooms = await roomModel.find({});
    res.send(rooms);
  } catch (e) {
    res.send(e);
  }
});

RoomRouter.get("/canJoin", async (req, res) => {
  const roomModel = mongoose.models.room;
  const uid = req.query.uid;

  try {
    const room = await roomModel.findOnde({ uid });

    if (!room) {
      res.statusCode = 404;
      throw Error("Room not found");
    }

    const { maxPlayers, playersAmount } = room;

    if (maxPlayers === playersAmount) {
      res.statusCode = 403;
      throw Error("The room is full");
    }

    req.send({ canJoin: true });
  } catch (e) {
    res.send({ canJoin: true, error: e });
  }
});

RoomRouter.post("/", async (req, res) => {
  const roomModel = mongoose.models.room;
  const name = req.body.name;
  const room = new roomModel({
    uid: Math.random().toString(36).substring(7),
    name,
  });

  try {
    await room.save();
    res.statusCode = 200;
    res.send();
  } catch (e) {
    res.statusCode = 422;
    res.send(e);
  }
});
