import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { BufferMemory } from "langchain/memory";
import Redis from "ioredis";
import { RedisChatMessageHistory } from "@langchain/community/stores/message/ioredis";

// 1. Initialize Redis client with TLS (for Upstash)
const redisClient = new Redis(process.env.REDIS_URL, {
  tls: {}, // Required for rediss://
});

// 2. Main Agent Function
export const runAgentWithSession = async (question, sessionId) => {
  const model = new ChatOpenAI({ temperature: 0, modelName: "gpt-4" });

  // Redis-based message history
  const messageHistory = new RedisChatMessageHistory({
    sessionId,
    client: redisClient,
    sessionTTL: 60 * 60 * 24, // 1 day expiry
  });

  // Attach to memory
  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    inputKey: "input",
    outputKey: "output",
    chatHistory: messageHistory,
  });

  const tools = [
    new SerpAPI(process.env.SERP_API_KEY, {
      location: "India",
      hl: "en",
      gl: "in",
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "openai-functions",
    memory,
    verbose: true,
  });

  const response = await executor.run(question);
  return response;
};
