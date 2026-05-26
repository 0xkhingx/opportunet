# OpportuNet Agent 🎯

> An AI agent that hunts, scores, and surfaces the right opportunities for you — hackathons, grants, freelance gigs, Web3 projects — before they slip through.

Built with **Gemini AI** + **Google Cloud Agent Builder** + **MongoDB MCP server** for the Google Cloud Rapid Agent Hackathon.

## The Problem
Developers, students, and creatives miss opportunities every day — not because they don't exist, but because they're scattered across dozens of platforms and impossible to track manually.

## The Solution
OpportuNet is an AI agent that:
1. **Hunts** opportunities from Devpost, Gitcoin, Upwork, grant databases, and Web3 boards
2. **Learns your profile** — skills, interests, location, experience level
3. **Scores each opportunity** using Gemini reasoning (0–100 fit score + plain-English reason)
4. **Tracks your applications** — saved, applied, won
5. **Reminds you** before deadlines expire

## Tech Stack
- **Agent**: Gemini 1.5 Flash via Google AI Studio
- **Orchestration**: Google Cloud Agent Builder
- **Database**: MongoDB Atlas + MongoDB MCP server
- **Backend**: Node.js + Express
- **Frontend**: React + Vite

## Setup

### 1. Clone & install
```bash
git clone https://github.com/yourusername/opportunet
cd opportunet/backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in MONGODB_URI and GEMINI_API_KEY
```

### 3. Seed the database
```bash
cd ../scripts
node seed.js
```

### 4. Run the backend
```bash
cd ../backend
npm run dev
```

### 5. Health check
```
GET http://localhost:3001/health
```

## Architecture
See `/docs/architecture.md` for full system diagram.

## License
MIT
