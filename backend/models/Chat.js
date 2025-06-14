import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [messageSchema],
});

export default mongoose.model("Chat", chatSchema);
