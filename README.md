# 🧠 FounderMindAI — GenAi Powered StartUp Idea Validator

An advanced AI-powered platform built with React + Vite + FastAPI + Groq. Transform raw startup ideas into investor-ready business plans through **6 specialized AI agents** that perform market research, business strategy, product architecture, investor evaluation, pitch deck generation, and execution planning—all streamed live in real time.

---

## 🌐 Live Demo

Try the app here: **[FounderMindAI](https://founder-mind-ai.vercel.app)**

> ⚡ Backend is hosted on Render (free tier), so the first request may take around 30 seconds to wake up.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 Market Research Agent | Opportunity score, competitor analysis, market trends, and gap identification |
| 💼 Business Strategy Agent | Revenue model, pricing strategy, customer segments, and value proposition |
| 🏗️ Product Architecture Agent | MVP features, recommended tech stack, and development roadmap |
| 💰 VC Investor Agent | Funding score, investment verdict, risk analysis, and VC-style questions |
| 🎯 Pitch Deck Agent | Automatically generates a professional investor-ready pitch deck |
| 🚀 Execution Plan Agent | Structured 30 / 60 / 90-day execution roadmap with milestones |
| 📡 Live Streaming | Real-time Server-Sent Events (SSE) streaming as each agent completes |
| 📄 PDF Export | Download the complete startup analysis as a branded PDF report |
| 📊 PPTX Export | Download the investor pitch deck as a presentation-ready PowerPoint |
| 🌑 Premium UI | Modern dark interface with FounderMindAI branding |

---

## 🚀 Setup

### 1. Clone & install

```bash
git clone https://github.com/Bavithran-G/FounderMindAI.git
cd FounderMindAI

npm install
```

### 2. Get a Groq API Key

1. Visit https://console.groq.com
2. Sign in or create an account
3. Generate a free API key

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
VITE_GROQ_API_KEY="your_groq_api_key"
```

### 4. Run the application

**Frontend**

```bash
npm run dev

# → http://localhost:5173
```

**Backend**

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r server/requirements.txt

uvicorn server.main:app --reload

# → http://localhost:8000
```

---

## 🏗️ Architecture

```text
FounderMindAI/

├── server/
│   ├── agents/
│   │   ├── market_research.py      # Market Research Agent
│   │   ├── business_strategy.py    # Business Strategy Agent
│   │   ├── product_architect.py    # Product Architecture Agent
│   │   ├── investor_agent.py       # VC Investor Agent
│   │   ├── pitch_deck.py           # Pitch Deck Agent
│   │   └── execution_agent.py      # Execution Plan Agent
│   │
│   ├── utils/
│   │   └── ai.py                   # Groq API client
│   │
│   ├── main.py                     # FastAPI server + SSE streaming
│   └── requirements.txt
│
├── src/
│   ├── components/
│   ├── utils/
│   │   ├── downloadPDF.js
│   │   └── downloadPPT.js
│   ├── App.jsx
│   └── index.css
│
├── .env
├── package.json
└── vite.config.js
```

---

## 🤖 Agent Pipeline

```text
User Startup Idea
        │
        ▼
🔍 Market Research Agent
        │
        ▼
💼 Business Strategy Agent
        │
        ▼
🏗️ Product Architecture Agent
        │
        ▼
💰 VC Investor Agent
        │
        ▼
🎯 Pitch Deck Agent
        │
        ▼
🚀 Execution Plan Agent
        │
        ▼
Investor-Ready Startup Report
```

All six AI agents execute sequentially through a centralized orchestration pipeline. Results are streamed live using **Server-Sent Events (SSE)**, allowing users to monitor the startup analysis in real time while generating downloadable PDF reports and PowerPoint pitch decks.

---

## 📋 Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Python | 3.10 or higher |
| Node.js | 18 or higher |
| Groq API Key | Free from https://console.groq.com |

---

## 📄 License

This project is licensed under the **MIT License**.
