import express from "express";
import "dotenv/config";
import chalk from "chalk";
import cors from "cors";
import serveStatic from "serve-static";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", // Allow requests from all origins
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow all HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow these headers
  credentials: true, // Allow sending cookies across origins
};

// middleware
// app.use(
//   fileUpload({
//     useTempFiles: true,
//   })
// );

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View Credentials' below to copy your API secret
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads"));
app.use(serveStatic(path.join(__dirname, "./src/routes", "uploads")));
app.use(express.static(path.join(__dirname, "/frontend/dist")));
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
import appRoute from "./src/routes/index.js";
import prisma from "./src/db/db.config.js";
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
