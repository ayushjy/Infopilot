import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function Chat() {
  // Extract the `sessionId` from the URL using React Router
  const { sessionId } = useParams();

  // Used to programmatically navigate to a new route (for new chat session)
  const navigate = useNavigate();

  // Local state to store the user's question (input field)
  const [question, setQuestion] = useState("");

  // All messages in the current session (both user and AI)
  const [messages, setMessages] = useState([]);

  // Flag to indicate if response is being fetched from backend
  const [loading, setLoading] = useState(false);

  // Ref to scroll to bottom when a new message is added
  const bottomRef = useRef(null);

  // On component mount or session change, fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`https://infopilot.onrender.com/api/chat/history/${sessionId}`);
        const data = await res.json();

        // If previous messages exist, load them
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    };

    fetchChatHistory();
  }, [sessionId]); // Dependency: re-run when sessionId changes

  // Scroll to the bottom every time messages are updated
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send user question to backend
  const ask = async () => {
    if (!question.trim()) return; // Ignore if empty input
    setLoading(true); // Show loading

    try {
      // POST request to backend with sessionId and question
      const res = await fetch("https://infopilot.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, sessionId }),
      });

      const data = await res.json();

      // Append user message and AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "ai", text: data.answer },
      ]);

      setQuestion(""); // Clear input field
    } catch (error) {
      console.error("Error fetching AI response:", error);

      // In case of error, still show user question + error message
      setMessages((prev) => [
        ...prev,
        { role: "user", text: question },
        { role: "ai", text: "Sorry, something went wrong." },
      ]);
    } finally {
      setLoading(false); // Hide loading
    }
  };

  // Start a completely new chat session
  const newChat = async () => {
    try {
      // Request backend to clear previous session data (Redis or memory)
      await fetch("https://infopilot.onrender.com/api/chat/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch (err) {
      console.error("Error clearing chat history:", err);
    }

    setMessages([]); // Clear UI

    const newSessionId = crypto.randomUUID(); // Generate a unique session ID
    navigate(`/chat/${newSessionId}`); // Navigate to new chat route
  };

  // When Enter key is pressed, trigger the `ask()` function
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      ask();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white px-4 py-6">
      {/* Header: App name and "New Chat" button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">InfoPilot 🧠</h1>
        <button
          onClick={newChat}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          New Chat
        </button>
      </div>

      {/* Chat window - messages list */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg text-sm whitespace-pre-wrap ${m.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
                }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {/* Empty div for scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input section */}
      <div className="mt-6 flex gap-2">
        {/* Text input field */}
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          placeholder="Ask anything..."
          className="flex-1 p-3 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Submit button */}
        <button
          onClick={ask}
          disabled={loading || !question.trim()}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}

export default Chat;
