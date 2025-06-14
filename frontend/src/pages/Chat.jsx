import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const ask = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, sessionId }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "ai", text: data.answer },
      ]);
      setQuestion("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const newChat = async () => {
  try {
    // Clear Redis chat history for current sessionId
    await fetch("http://localhost:5000/api/chat/clear", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
  } catch (error) {
    console.error("Error clearing chat history:", error);
  }

  setMessages([]); // clear UI messages
  const newSessionId = crypto.randomUUID(); // create fresh session ID
  navigate(`/chat/${newSessionId}`); // route to new chat
};


  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">InfoPilot 🧠</h1>
        <button
          onClick={newChat}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          New Chat
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              m.role === "user" ? "bg-gray-800" : "bg-gray-700"
            }`}
          >
            <strong>{m.role === "user" ? "You" : "InfoPilot"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Ask anything..."
        />
        <button
          onClick={ask}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Ask
        </button>
      </div>
    </div>
  );
}

export default Chat;
