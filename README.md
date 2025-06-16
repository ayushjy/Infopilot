# 🧭 InfoPilot — AI-powered Web Search Agent

InfoPilot is an intelligent, multi-turn conversational web application built with Langchain.js, OpenAI, and SerpAPI. It helps users retrieve real-time information from the web in natural language using an agent-based system powered by LLMs.

## 🌐 Live Demo
> https://infopilot-ayushjy.vercel.app

## ✨ Features

- 🌍 **Web Search Agent**: Uses SerpAPI to fetch real-time search results and answers questions naturally.
- 🧠 **Multi-turn Memory**: Maintains conversation context per session using Redis-based BufferMemory.
- 💬 **Chat UI**: Clean, ChatGPT-style left/right aligned conversation interface.
- 🗂️ **Session-based History**: Chat is scoped per session, ensuring isolated and persistent conversation threads.
- 🧾 **Clear & View Chat History**: View past conversations and clear them anytime.
- 🔐 **Authentication** (Coming soon): Support for user login/logout.
- 🛠️ **Admin Dashboard** (Planned): Monitor sessions, logs, and usage metrics.


## 🏗️ Architecture Overview  Client (React)
↳ New Chat / Ask a Question  
↳ Express.js Backend (Node.js)  
↳ Langchain Agent (OpenAI + SerpAPI)  
↳ Redis (for chat memory)  
↳ MongoDB (for permanent history)


---

## 🧰 Tech Stack

| Category           | Tech                                       |
|--------------------|--------------------------------------------|
| 💻 Frontend        | React.js, TailwindCSS                      |
| 🧠 LLM & Agents     | Langchain.js, OpenAI, SerpAPI              |
| 💬 Memory          | Redis + BufferMemory (via Upstash Redis)  |
| 🗄️ Database         | MongoDB Atlas                             |
| 🔧 Backend         | Node.js, Express.js                        |
| 🚀 Deployment      | Render(Backend) / Vercel(Frontend)      |

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/infopilot.git
cd infopilot
```

### 2. Install Dependencies  
```bash
cd backend
npm install

cd ../frontend
npm install
```
### 3. Environment Variables

Create a .env file in the backend directory:  
PORT=5000  
OPENAI_API_KEY=your_openai_key  
SERP_API_KEY=your_serpapi_key  
REDIS_URL=your_upstash_redis_url  
MONGODB_URI=your_mongodb_atlas_url  

### 4. Run the Project
```bash
# Run backend
cd backend
npm run dev

# Run frontend
cd ../frontend
npm start
```

🧑‍💻 Author  
Made with ❤️ by Ayush Jyoti
