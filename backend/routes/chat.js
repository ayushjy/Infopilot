import express from "express";
import { runAgentWithSession } from "../agent/webSearchAgent.js";
import { RedisChatMessageHistory } from "@langchain/redis";
import Chat from "../models/Chat.js";

const router = express.Router();

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

router.post("/clear", async (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "SessionId required" });

  try {
    // Initialize RedisChatMessageHistory with sessionId and redis URL
    const chatHistory = new RedisChatMessageHistory({
      sessionId,
      url: process.env.REDIS_URL,
    });

    // Clear the Redis messages for this session
    await chatHistory.clear();

    res.status(200).json({ message: "Chat history cleared" });
  } catch (error) {
    console.error("Error clearing chat history:", error);
    res.status(500).json({ error: "Failed to clear chat history" });
  }
});

// GET messages by sessionId
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
