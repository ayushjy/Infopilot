import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL,
});

client.on("error", (err) => console.error("Redis connection error:", err));
client.connect();

export default client;
