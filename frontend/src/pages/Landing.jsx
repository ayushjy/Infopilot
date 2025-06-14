import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  const startChat = () => {
    const sessionId = crypto.randomUUID();
    navigate(`/chat/${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-10">
      <h1 className="text-5xl font-bold mb-4 hover:scale-105 transition-all">Welcome to InfoPilot 🚀</h1>
      <p className="text-lg text-gray-300 max-w-xl mb-6">
        Your intelligent AI assistant that searches the web in real-time to give you the freshest, smartest answers.
      </p>
      <button onClick={startChat} className="bg-indigo-600 px-6 py-3 rounded text-white text-lg hover:bg-indigo-700 transition-all">
        Start Chatting
      </button>
    </div>
  );
}
