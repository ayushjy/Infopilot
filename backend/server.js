// index.js or server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js"; // make sure extension is .js

connectDB();
dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json()); // optional, express.json() is enough
app.use(express.json());

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
