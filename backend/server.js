// index.js or server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js";
connectDB();
dotenv.config();

const app = express();

app.use(cors({
    origin: 'https://infopilot-lilac.vercel.app', // frontend URL
}));
app.use(express.json());

app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'QueryHub backend is running!' });
});