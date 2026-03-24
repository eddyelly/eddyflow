"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── Mobile detection hook ───────────────────────────────────────────────────
function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Typing animation ────────────────────────────────────────────────────────
function TypeWriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(word.slice(0, text.length + 1));
        if (text.length + 1 === word.length) setTimeout(() => setDeleting(true), 2000);
      } else {
        setText(word.slice(0, text.length - 1));
        if (text.length === 0) { setDeleting(false); setIdx((i) => (i + 1) % words.length); }
      }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return <span className="gradient-text typing">{text}</span>;
}

// ─── Meteor shower ───────────────────────────────────────────────────────────
function Meteors({ count = 20 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="meteor" style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          "--dur": `${2 + Math.random() * 4}s`,
          "--delay": `${Math.random() * 5}s`,
        } as React.CSSProperties} />
      ))}
    </>
  );
}

// ─── Floating particles ──────────────────────────────────────────────────────
function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-violet-500/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.2 + Math.random() * 0.4,
          }} />
      ))}
    </div>
  );
}

const SWARMS = [
  { icon: "💻", name: "Dev Swarm", desc: "Architect → Code → Test → Review. Ship features 10x faster with coordinated AI agents.", agents: 12, badge: "Most Popular", delay: "delay-100" },
  { icon: "📊", name: "Research Swarm", desc: "Search → Analyze → Synthesize → Report. Deep research in minutes, not hours.", agents: 8, badge: null, delay: "delay-200" },
  { icon: "✍️", name: "Content Empire", desc: "Ideate → Write → SEO → Publish. Content at scale without the bottleneck.", agents: 10, badge: null, delay: "delay-300" },
  { icon: "🎯", name: "Marketing Swarm", desc: "Strategy → Copy → Social → Email. Full campaigns on autopilot.", agents: 9, badge: null, delay: "delay-100" },
  { icon: "🤝", name: "Support Swarm", desc: "Classify → Respond → Escalate. 24/7 intelligent customer support.", agents: 6, badge: "New", delay: "delay-200" },
];

const STATS = [
  { target: 60, suffix: "s", label: "To launch a swarm" },
  { target: 60, suffix: "+", label: "Specialized agents" },
  { target: 5, suffix: "", label: "Starter templates" },
  { target: 0, suffix: "", label: "Setup required" },
];

const FEATURES = [
  { icon: "⚡", title: "60-second launch", desc: "No CLI. No Docker. No config files. Pick a template and go." },
  { icon: "🧠", title: "Self-learning swarms", desc: "Agents coordinate autonomously, learn from each task, get smarter over time." },
  { icon: "🔐", title: "Your keys, your data", desc: "We never store your Anthropic API key. It never touches our servers." },
  { icon: "🌐", title: "Any task, any scale", desc: "From a quick research task to a full software project — swarms handle it all." },
  { icon: "📡", title: "Real-time monitoring", desc: "Watch every agent in your swarm work in real time through the live dashboard." },
  { icon: "🧩", title: "Fully customizable", desc: "Start with templates or build your own custom multi-agent configuration." },
];

const LOG_LINES = [
  { agent: "👑 Queen", msg: "Task received: Build a REST API with JWT auth", color: "text-violet-300" },
  { agent: "🏗️ Architect", msg: "Designing system architecture... done ✓", color: "text-blue-300" },
  { agent: "💻 Coder #1", msg: "Writing authentication module...", color: "text-green-300" },
  { agent: "💻 Coder #2", msg: "Building database schema...", color: "text-green-300" },
  { agent: "🧪 Tester", msg: "Running test suite... 47/47 passed ✓", color: "text-yellow-300" },
  { agent: "🔍 Reviewer", msg: "Code review complete. 0 issues ✓", color: "text-orange-300" },
  { agent: "👑 Queen", msg: "✅ Task complete in 3m 42s", color: "text-violet-300" },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [visibleLogs, setVisibleLogs] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isMobile = useMobile();
  useScrollReveal();

  // Animate logs
  useEffect(() => {
    if (visibleLogs >= LOG_LINES.length) return;
    const t = setTimeout(() => setVisibleLogs(v => v + 1), 900);
    return () => clearTimeout(t);
  }, [visibleLogs]);

  // Mouse parallax
  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <main className="min-h-screen bg-[#050008] text-white overflow-hidden">

      {/* ── Mobile Banner ── */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-violet-900/95 to-indigo-900/95 backdrop-blur-xl border-t border-violet-500/30 p-4 flex items-start gap-3 shadow-2xl">
          <span className="text-2xl flex-shrink-0">💻</span>
          <div>
            <p className="font-bold text-sm text-white">Best on desktop</p>
            <p className="text-white/60 text-xs mt-0.5">EddyFlow dashboard is optimized for PC. Use a laptop or desktop for the full experience.</p>
          </div>
          <button
            onClick={() => document.querySelector(".mobile-banner")?.remove()}
            className="ml-auto text-white/40 hover:text-white flex-shrink-0 text-lg leading-none"
          >✕</button>
        </div>
      )}

      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Orbs with mouse parallax */}
        <div className="absolute top-[-15%] left-[5%] w-[800px] h-[800px] rounded-full bg-violet-700/10 blur-[160px] transition-transform duration-1000"
          style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }} />
        <div className="absolute bottom-[-15%] right-[0%] w-[600px] h-[600px] rounded-full bg-indigo-700/10 blur-[140px] transition-transform duration-1000"
          style={{ transform: `translate(${-mousePos.x * 20}px, ${-mousePos.y * 20}px)` }} />
        <div className="absolute top-[35%] right-[15%] w-[400px] h-[400px] rounded-full bg-purple-600/6 blur-[100px]" />
        <div className="absolute inset-0 grid-bg" />
        <Meteors count={15} />
      </div>

      <Particles />

      {/* ── Nav ── */}
      <nav className="relative z-20 border-b border-violet-500/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-base shadow-lg shadow-violet-500/40 animate-glow-pulse">E</div>
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur opacity-30 -z-10" />
            </div>
            <span className="font-black text-xl tracking-tight">EddyFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            {["#swarms", "#features", "#how", "#pricing"].map((href) => (
              <a key={href} href={href} className="hover:text-white transition-colors relative group">
                {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-400 group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3 animate-fade-in">
            <Link href="/auth" className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
            <Link href="/auth" className="relative px-4 md:px-5 py-2 md:py-2.5 btn-primary rounded-xl text-sm font-bold shadow-lg shadow-violet-500/30 overflow-hidden">
              <span className="relative z-10">Get Started →</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pt-20 md:pt-32 pb-16 md:pb-20 text-center">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-violet-300 mb-10 border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-default group">
              <div className="relative">
                <span className="w-2 h-2 rounded-full bg-violet-400 block" />
                <span className="absolute inset-0 w-2 h-2 rounded-full bg-violet-400 animate-ping" />
              </div>
              Powered by Ruflo · Claude AI · 60+ Specialized Agents
              <span className="text-violet-500 group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
              Deploy{" "}
              <TypeWriter words={["AI swarms", "Dev agents", "Research bots", "Content teams"]} />
              <br />
              <span className="text-white/90">in 60 seconds.</span>
            </h1>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <p className="text-base sm:text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed font-light">
              No CLI. No config. No setup. Just pick a template,
              add your API key, and watch <span className="text-violet-300">60+ coordinated agents</span> work for you.
            </p>
          </div>

          <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center mb-24" style={{ animationDelay: "0.4s", opacity: 0 }}>
            <Link href="/auth" className="group relative px-10 py-5 btn-primary rounded-2xl font-bold text-lg shadow-2xl shadow-violet-500/40 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                🌊 Launch Your First Swarm
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </Link>
            <a href="#swarms" className="px-10 py-5 glass border border-violet-500/20 hover:border-violet-500/40 rounded-2xl font-semibold text-lg transition-all hover:bg-violet-500/5 group">
              <span className="flex items-center gap-2">
                See Templates
                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
              </span>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s, i) => (
              <div key={s.label} className="reveal glass-card rounded-2xl p-5 border border-violet-500/10" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-4xl font-black gradient-text-static mb-1">
                  <Counter target={s.target} suffix={s.suffix} />
                </div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Live terminal ── */}
        <section className="max-w-4xl mx-auto px-6 pb-28">
          <div className="reveal-scale glass rounded-3xl border border-violet-500/20 overflow-hidden shadow-2xl shadow-violet-500/10">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-6 py-4 bg-violet-500/5 border-b border-violet-500/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
                </div>
                <span className="text-white/30 text-sm font-mono ml-3">eddyflow — Dev Swarm</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">RUNNING</span>
              </div>
            </div>

            {/* Terminal body */}
            <div className="p-6 font-mono text-sm space-y-3 min-h-[280px]">
              {LOG_LINES.slice(0, visibleLogs).map((line, i) => (
                <div key={i} className="flex items-start gap-3 animate-slide-up" style={{ animationDelay: "0s" }}>
                  <span className="text-white/20 w-6 text-right flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`${line.color} flex-shrink-0`}>[{line.agent}]</span>
                  <span className="text-white/60">{line.msg}</span>
                </div>
              ))}
              {visibleLogs < LOG_LINES.length && (
                <div className="flex items-center gap-2 text-violet-400/50">
                  <span className="inline-block w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <span className="animate-pulse">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Swarm templates ── */}
        <section id="swarms" className="max-w-7xl mx-auto px-6 pb-28">
          <div className="text-center mb-16">
            <div className="reveal text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">Templates</div>
            <h2 className="reveal text-5xl md:text-6xl font-black mb-5">Ready-made swarms</h2>
            <p className="reveal text-white/40 text-xl max-w-xl mx-auto">Pick one. Launch in 60 seconds. Watch 60+ agents work.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {SWARMS.map((s, i) => (
              <div key={s.name} className={`reveal glass-card rounded-3xl p-7 border border-violet-500/10 relative group cursor-pointer glow-border ${s.badge === "Most Popular" ? "border-violet-500/30" : ""}`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                {s.badge && (
                  <div className={`absolute -top-3 left-6 px-3 py-1 text-xs font-bold rounded-full ${s.badge === "Most Popular" ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white" : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"}`}>
                    {s.badge}
                  </div>
                )}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
                <h3 className="font-black text-xl mb-2 group-hover:gradient-text-static transition-all">{s.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(s.agents, 5) }).map((_, j) => (
                      <div key={j} className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/40 to-indigo-500/40 border border-violet-500/30 flex items-center justify-center text-[8px]" style={{ marginLeft: j > 0 ? "-6px" : 0 }}>
                        🤖
                      </div>
                    ))}
                    <span className="text-xs text-violet-400 ml-1">+{s.agents - 5} agents</span>
                  </div>
                  <Link href="/auth" className="text-xs text-white/30 hover:text-violet-400 transition-colors group-hover:text-violet-400">
                    Launch →
                  </Link>
                </div>
              </div>
            ))}

            {/* Custom */}
            <div className="reveal glass-card rounded-3xl p-7 border border-dashed border-violet-500/20 cursor-pointer flex flex-col items-center justify-center text-center group" style={{ transitionDelay: "0.5s" }}>
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-violet-500/30 flex items-center justify-center text-2xl mb-4 group-hover:border-violet-500/60 group-hover:scale-110 transition-all duration-300">➕</div>
              <h3 className="font-bold text-lg text-white/40 group-hover:text-white transition-colors">Custom Swarm</h3>
              <p className="text-white/25 text-sm mt-2">Build your own agent configuration</p>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="max-w-7xl mx-auto px-6 pb-28">
          <div className="text-center mb-16">
            <div className="reveal text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">Features</div>
            <h2 className="reveal text-5xl md:text-6xl font-black mb-5">Everything you need.</h2>
            <p className="reveal text-white/40 text-xl">Nothing you don't.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`reveal glass-card rounded-3xl p-7 border border-violet-500/10 group`} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="text-4xl mb-5 group-hover:scale-110 group-hover:animate-float transition-all duration-300">{f.icon}</div>
                <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-16">
            <div className="reveal text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">How it works</div>
            <h2 className="reveal text-5xl md:text-6xl font-black mb-5">Three steps.</h2>
            <p className="reveal text-white/40 text-xl">That's literally it.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", icon: "🔑", title: "Connect your API key", desc: "Add your Anthropic API key. It never leaves your browser — we use it only to call Claude directly." },
                { step: "02", icon: "🎯", title: "Pick a template", desc: "Choose from Dev, Research, Content, Marketing, or Support swarms. Or build your own." },
                { step: "03", icon: "🚀", title: "Launch in 60s", desc: "Your swarm spins up instantly. Agents self-coordinate to complete your task automatically." },
              ].map((h, i) => (
                <div key={h.step} className={`reveal glass-card rounded-3xl p-8 border border-violet-500/10 text-center relative`} style={{ transitionDelay: `${i * 0.15}s` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-black shadow-lg shadow-violet-500/40">
                    {h.step}
                  </div>
                  <div className="text-5xl mb-5 mt-2">{h.icon}</div>
                  <h3 className="font-bold text-xl mb-3">{h.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-16">
            <div className="reveal text-violet-400 text-sm font-semibold tracking-widest uppercase mb-4">Pricing</div>
            <h2 className="reveal text-5xl md:text-6xl font-black mb-5">Simple pricing.</h2>
            <p className="reveal text-white/40 text-xl">Start free. Scale when ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$49", period: "/mo", sub: "50 swarm runs/month", features: ["5 swarm templates", "Up to 20 agents/swarm", "Email support", "Community access"], cta: "Start Free", highlight: false },
              { name: "Pro", price: "$99", period: "/mo", sub: "Unlimited runs", features: ["All templates + custom", "60+ agents per swarm", "Priority support", "Team collaboration", "API access"], cta: "Start Free", highlight: true },
              { name: "Enterprise", price: "Custom", period: "", sub: "Everything in Pro", features: ["Dedicated instances", "Custom agent training", "SLA guarantee", "Slack support", "On-premise option"], cta: "Contact Us", highlight: false },
            ].map((p, i) => (
              <div key={p.name} className={`reveal rounded-3xl p-8 border transition-all relative group ${p.highlight ? "bg-gradient-to-br from-violet-500/15 to-indigo-500/10 border-violet-500/40 shadow-2xl shadow-violet-500/20" : "glass border-violet-500/10 hover:border-violet-500/20"}`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                {p.highlight && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg">
                      Most Popular
                    </div>
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
                <h3 className="font-bold text-lg mb-2">{p.name}</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-5xl font-black gradient-text-static">{p.price}</span>
                  <span className="text-white/40 pb-2">{p.period}</span>
                </div>
                <p className="text-sm text-white/30 mb-6">{p.sub}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className={`relative block text-center py-3.5 rounded-xl font-bold transition-all overflow-hidden ${p.highlight ? "btn-primary" : "glass border border-violet-500/20 hover:border-violet-500/40"}`}>
                  <span className="relative z-10">{p.cta}</span>
                </Link>
              </div>
            ))}
          </div>
          <p className="reveal text-center text-white/25 text-sm mt-6">7-day free trial · No credit card required · Cancel anytime</p>
        </section>

        {/* ── Final CTA ── */}
        <section className="max-w-3xl mx-auto px-6 pb-28 text-center">
          <div className="reveal-scale glass rounded-3xl p-14 border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-indigo-500/10" />
            {/* Orbiting dots */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-64 h-64 opacity-20">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="orbit-dot absolute w-3 h-3 rounded-full bg-violet-400"
                    style={{ top: "50%", left: "50%", "--dur": `${3 + i}s`, "--delay": `${i * 0.75}s` } as React.CSSProperties} />
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="text-7xl mb-6 animate-float">🌊</div>
              <h2 className="text-4xl md:text-5xl font-black mb-5">Ready to flow?</h2>
              <p className="text-white/50 mb-10 text-lg max-w-md mx-auto">Deploy your first agent swarm in 60 seconds. Free to start.</p>
              {!submitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-4 glass border border-violet-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all" />
                  <button onClick={() => email && setSubmitted(true)}
                    className="px-8 py-4 btn-primary rounded-xl font-bold whitespace-nowrap shadow-lg shadow-violet-500/30">
                    Get Early Access
                  </button>
                </div>
              ) : (
                <div className="animate-scale-in text-violet-400 font-semibold text-xl">
                  ✅ You're on the list! We'll be in touch.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-violet-500/10 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-white/30 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black">E</div>
              <span className="font-bold text-white/50">EddyFlow</span>
              <span>— AI Agent Swarm Platform</span>
            </div>
            <div className="flex items-center gap-8">
              {["#swarms", "#features", "#how", "#pricing"].map((href) => (
                <a key={href} href={href} className="hover:text-white/60 transition-colors capitalize">{href.slice(1)}</a>
              ))}
              <Link href="/auth" className="hover:text-white/60 transition-colors">Sign in</Link>
            </div>
            <div>Built with 🌊 by <strong className="text-white/50">Edward Elisha</strong></div>
          </div>
        </footer>

      </div>
    </main>
  );
}
