import express from "express";
import "dotenv/config";
import chalk from "chalk";
import cors from "cors";
import serveStatic from "serve-static";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// app.get("/", (req, res) => {
//   return res.send("hello /");
// });

const corsOptions = {
  origin: "*", // Allow requests from all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow these headers
  credentials: true, // Allow sending cookies across origins
};

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
app.use("/uploads", serveStatic(path.join(__dirname, "routes", "uploads")));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

import appRoute from "./routes/index.js";
import { METHODS } from "http";
import prisma from "./db/db.config.js";
app.use(appRoute);

app.listen(PORT, () =>
  console.log(chalk.bgBlue(`server running on port ${PORT}`))
);

(async () => {
  try {
    await prisma.$connect();
    console.log(chalk.bgWhite(chalk.green("Connected to the database")));
  } catch (e) {
    console.error(chalk.red("Failed to connect to the database"), e);
  }
})();
