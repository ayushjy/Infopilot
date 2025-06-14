import express from "express";
import { runAgentWithSession } from "../agent/webSearchAgent.js";
import { RedisChatMessageHistory } from "@langchain/redis";
import { BufferMemory } from "langchain/memory";

const router = express.Router();

router.post("/", async (req, res) => {
  const { question, sessionId } = req.body;

  try {
    const answer = await runAgentWithSession(question, sessionId);
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


export default router;
