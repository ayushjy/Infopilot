import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Chat() {
  // Extract sessionId from URL (e.g., /chat/:sessionId)
  const { sessionId } = useParams();

  // Navigation hook to redirect to a new chat session
  const navigate = useNavigate();

  // State to hold the current question input
  const [question, setQuestion] = useState("");

  // State to hold the list of all chat messages in the session
  const [messages, setMessages] = useState([]);

  // State to handle loading while waiting for the AI response
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch chat history from backend (MongoDB) when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`https://infopilot.onrender.com/api/chat/history/${sessionId}`);
        const data = await res.json();

        if (data.messages) {
          setMessages(data.messages); // Load existing messages into UI
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    fetchChatHistory();
  }, [sessionId]); // Re-run if sessionId changes (i.e., new chat)

  // 📤 Send a question to the backend and update the chat window
  const ask = async () => {
    if (!question.trim()) return; // Prevent sending empty messages
    setLoading(true); // Show loading indicator

    try {
      const res = await fetch("https://infopilot.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, sessionId }), // Send question + sessionId to backend
      });

      const data = await res.json();

      // Add both user and AI messages to local state
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "ai", text: data.answer },
      ]);

      setQuestion(""); // Clear input field
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // 🔁 Create a new chat session and clear previous one
  const newChat = async () => {
    try {
      // Clear Redis (or memory buffer) for current session
      await fetch("https://infopilot.onrender.com/api/chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }

    setMessages([]); // Clear messages from UI

    const newSessionId = crypto.randomUUID(); // Generate a new session ID
    navigate(`/chat/${newSessionId}`); // Redirect to new session route
  };

  // 🔄 Trigger "ask" function when Enter is pressed
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      ask();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">InfoPilot 🧠</h1>
        <button
          onClick={newChat}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition"
          disabled={loading}
        >
          New Chat
        </button>
      </div>

      {/* Chat messages */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded ${m.role === "user" ? "bg-gray-800" : "bg-gray-700"}`}
          >
            <strong>{m.role === "user" ? "You" : "InfoPilot"}:</strong> {m.text}
          </div>
        ))}
      </div>

      {/* Input field and Ask button */}
      <div className="mt-6 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="Ask anything..."
        />
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 transition"
        >
          {loading ? "Finding..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
