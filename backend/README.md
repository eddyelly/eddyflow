# EddyFlow API Server

WebSocket server that runs real Claude multi-agent swarms.

## Setup

```bash
npm install
node server.js
# Runs on port 3001
```

## Deploy to Railway (free)

1. Go to railway.app
2. New project → Deploy from GitHub → select eddyflow repo
3. Set root directory to `backend/`
4. Railway auto-detects Node.js and deploys
5. Copy the Railway WebSocket URL (wss://...)
6. Set NEXT_PUBLIC_API_WS in Vercel to that URL

## WebSocket Protocol

Send:
```json
{ "apiKey": "sk-ant-...", "swarmId": "dev", "task": "Build a REST API" }
```

Receive events:
- `{ type: "start", swarm, agents }`
- `{ type: "agent_start", agent, index, total }`
- `{ type: "token", agent, text }`
- `{ type: "agent_done", agent, index, total }`
- `{ type: "done" }`
- `{ type: "error", message }`
