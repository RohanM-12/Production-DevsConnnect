import express from "express";
import {
  followUser,
  unfollowUser,
} from "../controllers/connectionController.js";

const connectionRoutes = express.Router();

connectionRoutes.post("/follow", followUser);
connectionRoutes.post("/unfollow", unfollowUser);

export default connectionRoutes;
