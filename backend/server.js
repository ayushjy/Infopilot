import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
connectDB();

const app = express();

// Handle CORS
app.use(cors({
    origin: 'https://infopilot-ayushjy.vercel.app',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));
app.options('*', cors()); // Handle preflight requests

app.use(express.json());
app.use("/api/chat", chatRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'InfoPilot backend is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
