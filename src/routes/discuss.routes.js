import express from "express";
import {
  getChatRoomsList,
  getMessages,
  sendMessage,
} from "../controllers/discussController.js";

const discussRoutes = express.Router();

discussRoutes.get("/getChatRooms", getChatRoomsList);
discussRoutes.post("/sendMessage", sendMessage);
discussRoutes.get("/getMessages/:id", getMessages);

export default discussRoutes;
