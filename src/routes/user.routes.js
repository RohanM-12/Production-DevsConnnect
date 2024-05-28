import { Router } from "express";
import { createUser, loginUser } from "../controllers/userController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", createUser);
router.get("/login", loginUser);

router.get("/userAuth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
