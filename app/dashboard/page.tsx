"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const API_WS = process.env.NEXT_PUBLIC_API_WS || "ws://localhost:3001";

const TEMPLATES = [
  { id: "dev", icon: "💻", name: "Dev Swarm", desc: "Architect → Code → Test → Review", agents: 5, color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  { id: "research", icon: "📊", name: "Research Swarm", desc: "Search → Analyze → Synthesize → Report", agents: 5, color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30" },
  { id: "content", icon: "✍️", name: "Content Empire", desc: "Ideate → Write → SEO → Publish", agents: 5, color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/30" },
  { id: "marketing", icon: "🎯", name: "Marketing Swarm", desc: "Strategy → Copy → Social → Email", agents: 5, color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
  { id: "support", icon: "🤝", name: "Support Swarm", desc: "Classify → Respond → Escalate", agents: 5, color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30" },
];

// Simple markdown renderer
function Markdown({ content }: { content: string }) {
  const html = content
    .replace(/^### (.*)/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*)/gm, '<h2 class="text-lg font-bold text-violet-300 mt-5 mb-2">$1</h2>')
    .replace(/^# (.*)/gm, '<h1 class="text-xl font-bold text-white mt-5 mb-3">$1</h1>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em class="text-white/80 italic">$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-violet-300 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      const isHeader = content.includes('|---');
      return `<tr>${cells.map(c => `<td class="border border-white/10 px-3 py-1.5 text-sm text-white/70">${c.trim()}</td>`).join('')}</tr>`;
    })
    .replace(/^\|[-| ]+\|$/gm, '')
    .replace(/^---$/gm, '<hr class="border-white/10 my-3"/>')
    .replace(/^- (.*)/gm, '<li class="text-white/70 text-sm ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.*)/gm, '<li class="text-white/70 text-sm ml-4 list-decimal">$2</li>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>');

  // Wrap tables
  const withTables = html.replace(/(<tr>.*?<\/tr>)+/gs, (match) =>
    `<div class="overflow-x-auto my-3"><table class="w-full border-collapse border border-white/10 rounded-lg overflow-hidden text-sm">${match}</table></div>`
  );

  return (
    <div
      className="prose prose-invert max-w-none text-white/70 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: `<p class="mt-0">${withTables}</p>` }}
    />
  );
}

type LogEntry = { agent: string; text: string; type: "token" | "info" | "error" | "done" };

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [task, setTask] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"templates" | "custom">("templates");
  const [customAgents, setCustomAgents] = useState([
    { name: "Queen Agent", role: "You coordinate all agents. Break down the task and delegate." },
    { name: "Worker Agent", role: "You execute tasks assigned by the queen. Be thorough." },
  ]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentAgent, setCurrentAgent] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [agentOutputs, setAgentOutputs] = useState<Record<string, string>>({});
  const [finalOutput, setFinalOutput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  function saveKey() {
    if (apiKey.startsWith("sk-ant-") || apiKey.startsWith("sk-")) {
      setApiKeySaved(true);
    }
  }

  function addLog(entry: LogEntry) {
    setLogs(prev => [...prev, entry]);
  }

  function launch() {
    if (!task.trim() || !apiKeySaved || running) return;
    if (tab === "templates" && !selected) return;

    setRunning(true);
    setDone(false);
    setProgress(0);
    setCurrentAgent("");
    setLogs([]);
    setAgentOutputs({});
    setFinalOutput("");

    const payload: any = { apiKey, task };
    if (tab === "templates") {
      payload.swarmId = selected;
    } else {
      payload.swarmId = "custom";
      payload.customAgents = customAgents;
    }

    const ws = new WebSocket(API_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify(payload));
      addLog({ agent: "System", text: "🌊 Connecting to EddyFlow swarm...", type: "info" });
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "start") addLog({ agent: "System", text: `🚀 ${msg.swarm} launched with ${msg.agents} agents`, type: "info" });
      if (msg.type === "agent_start") {
        setCurrentAgent(msg.agent);
        setProgress(Math.round((msg.index / msg.total) * 100));
        addLog({ agent: msg.agent, text: "Starting...", type: "info" });
        setAgentOutputs(prev => ({ ...prev, [msg.agent]: "" }));
      }
      if (msg.type === "token") {
        setAgentOutputs(prev => ({ ...prev, [msg.agent]: (prev[msg.agent] || "") + msg.text }));
      }
      if (msg.type === "agent_done") {
        setProgress(Math.round(((msg.index + 1) / msg.total) * 100));
        addLog({ agent: msg.agent, text: "✓ Complete", type: "info" });
        // Last agent output = final result
        if (msg.index + 1 === msg.total) {
          setAgentOutputs(prev => {
            setFinalOutput(prev[msg.agent] || "");
            return prev;
          });
        }
      }
      if (msg.type === "done") {
        setProgress(100);
        setRunning(false);
        setDone(true);
        setCurrentAgent("");
        addLog({ agent: "System", text: "✅ Swarm complete!", type: "done" });
      }
      if (msg.type === "error") {
        setRunning(false);
        addLog({ agent: "System", text: `❌ ${msg.message}`, type: "error" });
      }
    };

    ws.onerror = () => { setRunning(false); addLog({ agent: "System", text: "❌ Connection error.", type: "error" }); };
    ws.onclose = () => { if (running) setRunning(false); };
  }

  function stopSwarm() { wsRef.current?.close(); setRunning(false); }

  function copyResult() {
    navigator.clipboard.writeText(finalOutput);
  }

  const activeAgents = Object.keys(agentOutputs);

  return (
    <main className="min-h-screen bg-[#050008] text-white relative">
      {isMobile && (
        <div className="fixed inset-0 z-[100] bg-[#050008] flex flex-col items-center justify-center text-center px-8">
          <div className="text-8xl mb-8">💻</div>
          <h2 className="text-3xl font-black mb-4">Switch to desktop</h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-sm">EddyFlow dashboard requires a desktop browser.</p>
          <Link href="/" className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl font-bold">← Back to Homepage</Link>
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      <nav className="relative z-20 border-b border-violet-500/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-sm">E</div>
            <span className="font-black text-xl">EddyFlow</span>
          </Link>
          <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg border ${apiKeySaved ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/40 border-white/10"}`}>
            <span className={`w-2 h-2 rounded-full ${apiKeySaved ? "bg-green-400 animate-pulse" : "bg-white/20"}`} />
            {apiKeySaved ? "API Connected" : "No API Key"}
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

        {/* API Key */}
        {!apiKeySaved && (
          <div className="glass rounded-3xl p-6 border border-violet-500/20 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🔑</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Connect your Anthropic API key</h3>
                <p className="text-white/40 text-sm mb-4">Used only to power your swarms — never stored on our servers.</p>
                <div className="flex gap-3">
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveKey()}
                    placeholder="sk-ant-..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 font-mono text-sm" />
                  <button onClick={saveKey} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-sm">Connect</button>
                </div>
                <p className="text-xs text-white/20 mt-2">Get yours at <a href="https://console.anthropic.com" target="_blank" className="text-violet-400 hover:underline">console.anthropic.com</a></p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left panel */}
          <div className="lg:col-span-1 space-y-5">

            {/* Task */}
            <div className="glass rounded-3xl p-6 border border-violet-500/10">
              <h2 className="font-bold text-lg mb-4">🎯 Your Task</h2>
              <textarea value={task} onChange={(e) => setTask(e.target.value)} disabled={running}
                placeholder="Describe what you want to accomplish..."
                rows={4}
                className="w-full bg-white/5 border border-violet-500/10 rounded-2xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/40 text-sm leading-relaxed disabled:opacity-50" />
            </div>

            {/* Template / Custom tabs */}
            <div className="glass rounded-3xl p-5 border border-violet-500/10">
              <div className="flex bg-white/5 rounded-xl p-1 mb-4">
                <button onClick={() => setTab("templates")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "templates" ? "bg-violet-600 text-white" : "text-white/40"}`}>
                  Templates
                </button>
                <button onClick={() => setTab("custom")} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "custom" ? "bg-violet-600 text-white" : "text-white/40"}`}>
                  ✨ Custom
                </button>
              </div>

              {tab === "templates" ? (
                <div className="space-y-2">
                  {TEMPLATES.map((t) => (
                    <div key={t.id} onClick={() => !running && setSelected(t.id)}
                      className={`rounded-xl p-3 border cursor-pointer transition-all ${selected === t.id ? `bg-gradient-to-r ${t.color} ${t.border}` : "glass border-violet-500/10 hover:border-violet-500/20"} ${running ? "opacity-50 cursor-not-allowed" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{t.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{t.name}</div>
                          <div className="text-white/40 text-xs">{t.agents} agents</div>
                        </div>
                        {selected === t.id && <span className="ml-auto w-2 h-2 rounded-full bg-violet-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white/40 text-xs">Configure your own agents</p>
                  {customAgents.map((agent, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 border border-violet-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <input value={agent.name} onChange={(e) => {
                          const updated = [...customAgents];
                          updated[i].name = e.target.value;
                          setCustomAgents(updated);
                        }} className="bg-transparent text-sm font-semibold focus:outline-none text-white flex-1" placeholder="Agent name" />
                        {customAgents.length > 1 && (
                          <button onClick={() => setCustomAgents(customAgents.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 text-xs ml-2">✕</button>
                        )}
                      </div>
                      <textarea value={agent.role} onChange={(e) => {
                        const updated = [...customAgents];
                        updated[i].role = e.target.value;
                        setCustomAgents(updated);
                      }} rows={2} placeholder="Agent role/instructions..." className="w-full bg-transparent text-xs text-white/60 resize-none focus:outline-none placeholder-white/20" />
                    </div>
                  ))}
                  <button onClick={() => setCustomAgents([...customAgents, { name: `Agent ${customAgents.length + 1}`, role: "" }])}
                    className="w-full py-2 border border-dashed border-violet-500/30 rounded-xl text-violet-400 text-xs hover:border-violet-500/60 transition-all">
                    + Add Agent
                  </button>
                </div>
              )}
            </div>

            {/* Launch/Stop */}
            {!running ? (
              <button onClick={launch}
                disabled={(tab === "templates" && !selected) || !task.trim() || !apiKeySaved}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${(tab === "templates" ? selected : true) && task.trim() && apiKeySaved ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 shadow-lg shadow-violet-500/30" : "bg-white/5 text-white/20 cursor-not-allowed"}`}>
                🌊 Launch Swarm
              </button>
            ) : (
              <button onClick={stopSwarm} className="w-full py-4 rounded-2xl font-bold bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                ⏹️ Stop
              </button>
            )}
          </div>

          {/* Right panel */}
          <div className="lg:col-span-2 space-y-5">

            {/* Progress */}
            {(running || done) && (
              <div className="glass rounded-3xl p-5 border border-violet-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {running && <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />}
                    {done && <span className="w-2 h-2 rounded-full bg-green-400" />}
                    <span className="font-semibold text-sm">{done ? "✅ Swarm Complete!" : `Running: ${currentAgent}`}</span>
                  </div>
                  <span className="text-violet-400 font-bold">{progress}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${done ? "bg-green-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {/* ✨ Final Result Card */}
            {done && finalOutput && (
              <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <div className="font-bold text-emerald-300">Final Result</div>
                      <div className="text-white/40 text-xs">Synthesized output from all agents</div>
                    </div>
                  </div>
                  <button onClick={copyResult} className="text-xs px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg transition-all">
                    📋 Copy
                  </button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto">
                  <Markdown content={finalOutput} />
                </div>
              </div>
            )}

            {/* Agent outputs */}
            {activeAgents.length > 0 && (
              <div className="space-y-4">
                {activeAgents.map((agentName) => (
                  <div key={agentName} className="glass rounded-3xl border border-violet-500/10 overflow-hidden">
                    <div className="flex items-center gap-3 px-5 py-3 bg-violet-500/5 border-b border-violet-500/10">
                      <span className="font-mono text-sm text-violet-300 font-semibold">{agentName}</span>
                      {currentAgent === agentName && running && (
                        <span className="text-xs text-white/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> writing...
                        </span>
                      )}
                    </div>
                    <div className="p-5 max-h-64 overflow-y-auto">
                      <Markdown content={agentOutputs[agentName] || "..."} />
                      {currentAgent === agentName && running && <span className="animate-pulse text-violet-400">▊</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {activeAgents.length === 0 && (
              <div className="glass rounded-3xl border border-violet-500/10 flex flex-col items-center justify-center text-center p-20">
                <div className="text-6xl mb-4 opacity-20">🌊</div>
                <div className="text-white/30 font-medium mb-2">No swarm running</div>
                <div className="text-white/20 text-sm">Configure your task and launch a swarm to see live agent outputs here</div>
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <div className="glass rounded-3xl border border-violet-500/10 overflow-hidden">
                <div className="px-5 py-3 bg-violet-500/5 border-b border-violet-500/10 text-xs text-white/30 font-mono">System Logs</div>
                <div className="p-4 max-h-36 overflow-y-auto space-y-1">
                  {logs.map((log, i) => (
                    <div key={i} className={`text-xs font-mono ${log.type === "error" ? "text-red-400" : log.type === "done" ? "text-green-400" : "text-white/40"}`}>
                      [{log.agent}] {log.text}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
