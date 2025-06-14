// Use ESM imports instead of require
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "@langchain/redis";

dotenv.config();

export const runAgentWithSession = async (question, sessionId) => {
  const model = new ChatOpenAI({ temperature: 0, modelName: "gpt-4" });

  const memory = new BufferMemory({
    memoryKey: "chat_history",
    returnMessages: true,
    chatHistory: new RedisChatMessageHistory({
      sessionId,
      url: process.env.REDIS_URL,
    }),
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

  return await executor.run(question);
};
