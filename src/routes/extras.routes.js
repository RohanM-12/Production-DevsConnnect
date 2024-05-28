import express from "express";
import { getCollageNames } from "../controllers/userController.js";

const router = express.Router();

router.get("/api/institutes/:name/institute", getCollageNames);
export default router;
