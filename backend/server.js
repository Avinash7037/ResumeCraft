import express from "express";
import cors from "cors";
import "dotenv/config";
import { connnectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import resumeRouter from "./routes/resumeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());

// CONNECT DB
connnectDB();

// MIDDLEWARE
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/resume", resumeRouter);

// ✅ fixed static folder serving
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, _path) => {
      res.set(
        "Access-Control-Allow-Origin",
        "https://resumecraft-frontend-afqs.onrender.com"
      );
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Api working");
});

app.listen(PORT, () => {
  console.log(`server started on http://localhost:${PORT}`);
});
