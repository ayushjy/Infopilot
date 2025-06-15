import express from "express";
import { runAgentWithSession } from "../agent/webSearchAgent.js";
import Redis from "ioredis";
import { RedisChatMessageHistory } from "@langchain/community/stores/message/ioredis";
import Chat from "../models/Chat.js";

const router = express.Router();
const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {}, // Required for rediss://
});

// POST: Ask question
router.post("/", async (req, res) => {
  const { question, sessionId } = req.body;

  try {
    const answer = await runAgentWithSession(question, sessionId);

    let chat = await Chat.findOne({ sessionId });

    if (!chat) {
      chat = new Chat({ sessionId, messages: [] });
    }

    chat.messages.push({ role: "user", text: question });
    chat.messages.push({ role: "ai", text: answer });

    await chat.save();

    res.json({ answer });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Agent error" });
  }
});

// POST: Clear memory
router.post("/clear", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "SessionId required" });

  try {
    // Initialize RedisChatMessageHistory with sessionId and redis URL
    const messageHistory = new RedisChatMessageHistory({
      sessionId,
      client: redisClient,
    });

    await messageHistory.clear();

    res.status(200).json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

// GET: Fetch chat history
router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
