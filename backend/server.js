const express = require("express");
const cors = require("cors");
const { WebSocketServer } = require("ws");
const http = require("http");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// ─── Swarm templates ────────────────────────────────────────────────────────
const SWARM_CONFIGS = {
  dev: {
    name: "Dev Swarm",
    agents: [
      { name: "👑 Queen Agent", role: "You are the queen agent coordinating a software development task. Break the task into subtasks and delegate to specialists. Be concise." },
      { name: "🏗️ Architect", role: "You are a software architect. Design the system architecture, tech stack, and folder structure for the given task. Be specific and practical." },
      { name: "💻 Coder", role: "You are a senior software engineer. Write the actual code based on the architecture. Include complete, working implementations." },
      { name: "🧪 Tester", role: "You are a QA engineer. Write comprehensive tests for the code. Identify potential bugs and edge cases." },
      { name: "🔍 Reviewer", role: "You are a code reviewer. Review the code for best practices, security issues, and improvements. Give actionable feedback." },
    ],
  },
  research: {
    name: "Research Swarm",
    agents: [
      { name: "👑 Queen Agent", role: "You are coordinating a research task. Plan the research approach and synthesize findings from your agents." },
      { name: "🔍 Researcher #1", role: "You are a research analyst. Deeply analyze the first aspects of the research topic. Be thorough and cite key points." },
      { name: "🔍 Researcher #2", role: "You are a research analyst. Analyze different angles and perspectives of the topic. Look for counterarguments." },
      { name: "📊 Data Analyst", role: "You are a data analyst. Find relevant statistics, trends, and quantitative insights for the research topic." },
      { name: "✍️ Synthesizer", role: "You are a technical writer. Synthesize all research into a clear, structured, comprehensive report." },
    ],
  },
  content: {
    name: "Content Empire",
    agents: [
      { name: "👑 Queen Agent", role: "You are coordinating a content creation task. Direct your team to create exceptional content." },
      { name: "💡 Ideation Agent", role: "You are a creative strategist. Generate compelling angles, hooks, and content ideas for the topic." },
      { name: "✍️ Writer", role: "You are a world-class content writer. Write engaging, high-quality content based on the ideas provided." },
      { name: "🎯 SEO Agent", role: "You are an SEO specialist. Optimize the content for search engines. Suggest keywords, meta description, and improvements." },
      { name: "📱 Social Agent", role: "You are a social media expert. Repurpose the content into social media posts for Twitter, LinkedIn, and Instagram." },
    ],
  },
  marketing: {
    name: "Marketing Swarm",
    agents: [
      { name: "👑 Queen Agent", role: "You are a CMO coordinating a marketing campaign. Direct your team to create a full marketing strategy." },
      { name: "📊 Strategist", role: "You are a marketing strategist. Define the target audience, positioning, and campaign strategy." },
      { name: "✍️ Copywriter", role: "You are a world-class copywriter. Write compelling marketing copy — headlines, taglines, and ad copy." },
      { name: "📱 Social Media Manager", role: "You are a social media manager. Create a social media content calendar and posts for the campaign." },
      { name: "📧 Email Marketer", role: "You are an email marketing specialist. Write a 3-email nurture sequence for the campaign." },
    ],
  },
  support: {
    name: "Support Swarm",
    agents: [
      { name: "👑 Queen Agent", role: "You are coordinating a customer support response. Ensure comprehensive, empathetic responses." },
      { name: "🔍 Classifier", role: "You are a support classifier. Analyze the customer query, identify the issue type, urgency, and sentiment." },
      { name: "💬 Support Agent", role: "You are a senior customer support specialist. Write a complete, helpful, empathetic response to the customer." },
      { name: "📚 Knowledge Agent", role: "You are a knowledge base specialist. Identify relevant documentation, FAQs, and resources for this issue." },
      { name: "🔄 Escalation Agent", role: "You are an escalation specialist. Determine if this needs escalation and draft an internal escalation note if needed." },
    ],
  },
};

// ─── WebSocket swarm runner ──────────────────────────────────────────────────
wss.on("connection", (ws) => {
  ws.on("message", async (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON" }));
      return;
    }

    const { apiKey, swarmId, task } = payload;

    if (!apiKey || !swarmId || !task) {
      ws.send(JSON.stringify({ type: "error", message: "Missing apiKey, swarmId, or task" }));
      return;
    }

    const config = SWARM_CONFIGS[swarmId];
    if (!config) {
      ws.send(JSON.stringify({ type: "error", message: "Unknown swarm template" }));
      return;
    }

    const client = new Anthropic({ apiKey });

    // Signal start
    ws.send(JSON.stringify({ type: "start", swarm: config.name, agents: config.agents.length }));

    const memory = []; // shared context between agents

    try {
      for (let i = 0; i < config.agents.length; i++) {
        const agent = config.agents[i];
        const isFirst = i === 0;
        const isLast = i === config.agents.length - 1;

        ws.send(JSON.stringify({
          type: "agent_start",
          agent: agent.name,
          index: i,
          total: config.agents.length,
        }));

        // Build context from previous agents
        const contextMsg = memory.length > 0
          ? `\n\nPrevious agent outputs:\n${memory.map(m => `[${m.agent}]: ${m.output.slice(0, 500)}...`).join("\n\n")}`
          : "";

        const userMsg = isFirst
          ? `Task: ${task}`
          : `Original task: ${task}${contextMsg}\n\nNow perform your specific role for this task.`;

        // Stream the response
        let fullOutput = "";

        const stream = await client.messages.stream({
          model: "claude-haiku-4-5",
          max_tokens: 1024,
          system: agent.role,
          messages: [{ role: "user", content: userMsg }],
        });

        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta?.type === "text_delta") {
            const text = chunk.delta.text;
            fullOutput += text;
            ws.send(JSON.stringify({ type: "token", agent: agent.name, text }));
          }
        }

        memory.push({ agent: agent.name, output: fullOutput });

        ws.send(JSON.stringify({
          type: "agent_done",
          agent: agent.name,
          index: i,
          total: config.agents.length,
        }));

        // Small pause between agents
        await new Promise((r) => setTimeout(r, 300));
      }

      ws.send(JSON.stringify({ type: "done", message: "Swarm complete!" }));
    } catch (err) {
      const msg = err?.message || "Claude API error";
      ws.send(JSON.stringify({ type: "error", message: msg }));
    }
  });
});

// ─── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ status: "ok", service: "EddyFlow API" }));
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/templates", (req, res) => res.json(Object.entries(SWARM_CONFIGS).map(([id, c]) => ({ id, name: c.name, agents: c.agents.length }))));

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🌊 EddyFlow API running on port ${PORT}`));
