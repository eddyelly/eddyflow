"use client";

import { useState, useEffect } from "react";

const TEMPLATES = [
  { id: "dev", icon: "💻", name: "Dev Swarm", desc: "Architect → Code → Test → Review", agents: 12, color: "from-blue-500/20 to-indigo-500/20", border: "border-blue-500/30" },
  { id: "research", icon: "📊", name: "Research Swarm", desc: "Search → Analyze → Synthesize → Report", agents: 8, color: "from-green-500/20 to-emerald-500/20", border: "border-green-500/30" },
  { id: "content", icon: "✍️", name: "Content Empire", desc: "Ideate → Write → SEO → Publish", agents: 10, color: "from-orange-500/20 to-amber-500/20", border: "border-orange-500/30" },
  { id: "marketing", icon: "🎯", name: "Marketing Swarm", desc: "Strategy → Copy → Social → Email", agents: 9, color: "from-pink-500/20 to-rose-500/20", border: "border-pink-500/30" },
  { id: "support", icon: "🤝", name: "Support Swarm", desc: "Classify → Respond → Escalate", agents: 6, color: "from-violet-500/20 to-purple-500/20", border: "border-violet-500/30" },
];

type SwarmStatus = { id: string; name: string; icon: string; status: "running" | "complete"; progress: number; logs: string[] };

export default function Dashboard() {
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [task, setTask] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [activeSwarm, setActiveSwarm] = useState<SwarmStatus | null>(null);
  const [launching, setLaunching] = useState(false);

  function saveKey() {
    if (apiKey.startsWith("sk-ant-")) {
      setApiKeySaved(true);
    }
  }

  function launch() {
    if (!selected || !task || !apiKeySaved) return;
    const tmpl = TEMPLATES.find(t => t.id === selected)!;
    setLaunching(true);

    setTimeout(() => {
      setLaunching(false);
      setActiveSwarm({
        id: selected,
        name: tmpl.name,
        icon: tmpl.icon,
        status: "running",
        progress: 0,
        logs: ["🟣 Queen Agent initializing swarm...", "🔵 Spawning worker agents...", "🟢 Agents ready. Starting task..."],
      });

      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 15;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          setActiveSwarm(prev => prev ? { ...prev, status: "complete", progress: 100, logs: [...prev.logs, "✅ Task complete! Results ready."] } : null);
        } else {
          const msgs = [
            "🤖 Agent analyzing requirements...",
            "💡 Generating solution approach...",
            "⚡ Processing with Claude AI...",
            "🔄 Coordinating between agents...",
            "📝 Compiling results...",
          ];
          setActiveSwarm(prev => prev ? {
            ...prev,
            progress: Math.round(prog),
            logs: [...prev.logs, msgs[Math.floor(Math.random() * msgs.length)]],
          } : null);
        }
      }, 1200);
    }, 1500);
  }

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0010] text-white relative">

      {/* Mobile wall */}
      {isMobile && (
        <div className="fixed inset-0 z-[100] bg-[#050008] flex flex-col items-center justify-center text-center px-8">
          <div className="text-8xl mb-8 animate-bounce">💻</div>
          <h2 className="text-3xl font-black mb-4">Switch to desktop</h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            The EddyFlow dashboard is designed for desktop browsers. Please open this page on a laptop or PC for the best experience.
          </p>
          <div className="glass rounded-2xl p-5 border border-violet-500/20 max-w-sm w-full">
            <p className="text-sm text-white/40">Or browse on mobile:</p>
            <a href="/" className="mt-3 block px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-bold text-sm transition-all hover:opacity-90">
              ← Back to Homepage
            </a>
          </div>
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-[20%] w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 border-b border-violet-500/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-black">E</div>
            <span className="font-black text-xl">EddyFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg ${apiKeySaved ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-white/5 text-white/40 border border-white/10"}`}>
              <span className={`w-2 h-2 rounded-full ${apiKeySaved ? "bg-green-400" : "bg-white/20"}`} />
              {apiKeySaved ? "API Connected" : "No API Key"}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black">EE</div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">

        {/* API Key setup */}
        {!apiKeySaved && (
          <div className="glass rounded-3xl p-6 border border-violet-500/20 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-2xl">🔑</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">Connect your Anthropic API key</h3>
                <p className="text-white/40 text-sm mb-4">We never store your key. It's used only to power your swarms.</p>
                <div className="flex gap-3">
                  <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 font-mono text-sm transition-all" />
                  <button onClick={saveKey}
                    className="px-6 py-3 btn-primary rounded-xl font-bold text-sm">
                    Connect
                  </button>
                </div>
                <p className="text-xs text-white/20 mt-2">Get your key at console.anthropic.com</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — config */}
          <div className="lg:col-span-2 space-y-6">

            {/* Task input */}
            <div className="glass rounded-3xl p-6 border border-violet-500/10">
              <h2 className="font-bold text-lg mb-4">🎯 What do you want to build?</h2>
              <textarea value={task} onChange={(e) => setTask(e.target.value)}
                placeholder="Describe your task... e.g. 'Build a REST API for user authentication with JWT tokens and PostgreSQL database'"
                rows={4}
                className="w-full bg-white/5 border border-violet-500/10 rounded-2xl p-4 text-white placeholder-white/20 resize-none focus:outline-none focus:border-violet-500/40 transition-all text-sm leading-relaxed mb-4" />
              <button onClick={launch}
                disabled={!selected || !task || !apiKeySaved || launching}
                className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 ${selected && task && apiKeySaved && !launching ? "btn-primary shadow-lg shadow-violet-500/30" : "bg-white/5 text-white/20 cursor-not-allowed"}`}>
                {launching ? (
                  <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Launching swarm...</>
                ) : (
                  <><span>🌊</span> Launch Swarm in 60s</>
                )}
              </button>
            </div>

            {/* Templates */}
            <div>
              <h2 className="font-bold text-lg mb-4">🚀 Choose a swarm template</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {TEMPLATES.map((t) => (
                  <div key={t.id} onClick={() => setSelected(t.id)}
                    className={`rounded-2xl p-5 border cursor-pointer transition-all ${selected === t.id ? `bg-gradient-to-br ${t.color} ${t.border}` : "glass border-violet-500/10 hover:border-violet-500/20"}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <div className="font-bold mb-1 flex items-center gap-2">
                          {t.name}
                          {selected === t.id && <span className="w-2 h-2 rounded-full bg-violet-400" />}
                        </div>
                        <div className="text-white/50 text-xs">{t.desc}</div>
                        <div className="text-violet-400 text-xs mt-2">{t.agents} agents</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — live output */}
          <div>
            <h2 className="font-bold text-lg mb-4">📡 Live Output</h2>
            <div className="glass rounded-3xl border border-violet-500/10 overflow-hidden sticky top-6">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-violet-500/10">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-white/30 text-xs font-mono">
                  {activeSwarm ? `${activeSwarm.icon} ${activeSwarm.name}` : "No swarm running"}
                </span>
                {activeSwarm && (
                  <div className={`ml-auto text-xs px-2 py-0.5 rounded-full ${activeSwarm.status === "running" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                    {activeSwarm.status === "running" ? "Running" : "Complete"}
                  </div>
                )}
              </div>

              {activeSwarm ? (
                <div className="p-5">
                  {/* Progress */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-white/40 mb-2">
                      <span>Progress</span>
                      <span>{activeSwarm.progress}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeSwarm.progress}%` }} />
                    </div>
                  </div>
                  {/* Logs */}
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {activeSwarm.logs.map((log, i) => (
                      <div key={i} className="text-xs text-white/60 font-mono py-1 border-b border-white/5">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center text-white/20">
                  <div className="text-4xl mb-3 opacity-30">🌊</div>
                  <div className="text-sm">Launch a swarm to see live output here</div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
