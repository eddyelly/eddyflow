"use client";

import Link from "next/link";
import { useState } from "react";

const SWARMS = [
  { icon: "💻", name: "Dev Swarm", desc: "Architect → Code → Test → Review. Ship features 10x faster.", agents: 12, badge: "Most Popular" },
  { icon: "📊", name: "Research Swarm", desc: "Search → Analyze → Synthesize → Report. Deep research in minutes.", agents: 8, badge: null },
  { icon: "✍️", name: "Content Empire", desc: "Ideate → Write → SEO → Publish. Content at scale.", agents: 10, badge: null },
  { icon: "🎯", name: "Marketing Swarm", desc: "Strategy → Copy → Social → Email. Full campaigns automatically.", agents: 9, badge: null },
  { icon: "🤝", name: "Support Swarm", desc: "Classify → Respond → Escalate. 24/7 customer support.", agents: 6, badge: "New" },
];

const STATS = [
  { value: "60s", label: "To launch a swarm" },
  { value: "60+", label: "Specialized agents" },
  { value: "5", label: "Ready-made templates" },
  { value: "0", label: "Setup required" },
];

const HOW = [
  { step: "01", icon: "🔑", title: "Connect your API key", desc: "Add your Anthropic API key. We never store it — it goes directly to Claude." },
  { step: "02", icon: "🎯", title: "Pick a swarm template", desc: "Choose from Dev, Research, Content, Marketing, or Support swarms." },
  { step: "03", icon: "🚀", title: "Launch in 60 seconds", desc: "Your swarm spins up instantly. Agents coordinate automatically to complete your task." },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-[#0a0010] text-white overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[700px] h-[700px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" />
        <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-[80px]" />
        <div className="absolute inset-0 grid-bg opacity-100" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 border-b border-violet-500/10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-black">E</div>
            <span className="font-black text-xl tracking-tight">EddyFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#swarms" className="hover:text-white transition-colors">Swarms</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm text-white/50 hover:text-white transition-colors">Sign in</Link>
            <Link href="/auth" className="px-4 py-2 btn-primary rounded-xl text-sm font-bold">
              Get Started Free →
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-violet-300 mb-10 border border-violet-500/20">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            Powered by Ruflo · Claude AI · 60+ Specialized Agents
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
            Deploy AI swarms<br />
            <span className="gradient-text">in 60 seconds.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            No CLI. No config. No setup.
            Just pick a template, add your API key, and watch
            60+ coordinated agents work for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/auth" className="px-10 py-5 btn-primary rounded-2xl font-bold text-lg shadow-2xl shadow-violet-500/30">
              Launch Your First Swarm →
            </Link>
            <a href="#swarms" className="px-10 py-5 glass border border-violet-500/20 hover:border-violet-500/40 rounded-2xl font-semibold text-lg transition-all">
              See Templates
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 border border-violet-500/10">
                <div className="text-4xl font-black gradient-text mb-1">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Animated swarm visual */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="glass rounded-3xl border border-violet-500/20 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-white/30 text-sm font-mono">EddyFlow — Dev Swarm · Running</span>
                <div className="ml-auto flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Active
                </div>
              </div>
              <div className="space-y-3 font-mono text-sm">
                {[
                  { agent: "👑 Queen Agent", msg: "Task received: Build REST API with auth", color: "text-violet-300" },
                  { agent: "🏗️ Architect", msg: "Designing system architecture... done ✓", color: "text-blue-300" },
                  { agent: "💻 Coder #1", msg: "Writing user authentication module...", color: "text-green-300" },
                  { agent: "💻 Coder #2", msg: "Building database schema...", color: "text-green-300" },
                  { agent: "🧪 Tester", msg: "Running test suite... 47/47 passed ✓", color: "text-yellow-300" },
                  { agent: "🔍 Reviewer", msg: "Code review complete. No issues found ✓", color: "text-orange-300" },
                  { agent: "👑 Queen Agent", msg: "Task complete in 3m 42s. Delivering...", color: "text-violet-300" },
                ].map((line, i) => (
                  <div key={i} className={`flex items-start gap-3 ${i === 6 ? "opacity-100" : i > 3 ? "opacity-80" : "opacity-60"}`}>
                    <span className="text-white/30 flex-shrink-0 w-8 text-right">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`${line.color} flex-shrink-0`}>[{line.agent}]</span>
                    <span className="text-white/60">{line.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Swarm templates */}
        <section id="swarms" className="max-w-7xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black mb-4">Ready-made swarms</h2>
            <p className="text-white/40 text-xl">Pick one and launch in 60 seconds</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {SWARMS.map((s) => (
              <div key={s.name} className={`glass rounded-3xl p-7 border border-violet-500/10 card-glow transition-all relative group cursor-pointer ${s.badge === "Most Popular" ? "border-violet-500/30 bg-violet-500/5" : ""}`}>
                {s.badge && (
                  <div className={`absolute -top-3 left-6 px-3 py-1 text-xs font-bold rounded-full ${s.badge === "Most Popular" ? "bg-violet-500 text-white" : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"}`}>
                    {s.badge}
                  </div>
                )}
                <div className="text-4xl mb-4">{s.icon}</div>
                <h3 className="font-black text-xl mb-2 group-hover:gradient-text transition-all">{s.name}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-violet-400 font-medium">{s.agents} agents</span>
                  <Link href="/auth" className="text-xs text-white/40 hover:text-violet-400 transition-colors">Launch →</Link>
                </div>
              </div>
            ))}
            {/* Add your own */}
            <div className="glass rounded-3xl p-7 border border-dashed border-violet-500/20 card-glow transition-all cursor-pointer flex flex-col items-center justify-center text-center group">
              <div className="text-4xl mb-4 opacity-40 group-hover:opacity-100 transition-all">➕</div>
              <h3 className="font-bold text-lg text-white/40 group-hover:text-white transition-colors">Custom Swarm</h3>
              <p className="text-white/30 text-sm mt-2">Build your own agent configuration</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="max-w-5xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black mb-4">Dead simple.</h2>
            <p className="text-white/40 text-xl">Three steps. That's it.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW.map((h, i) => (
              <div key={h.step} className="relative">
                {i < 2 && <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-violet-500/30 to-transparent -translate-x-8 z-0" />}
                <div className="glass rounded-3xl p-8 border border-violet-500/10 relative z-10">
                  <div className="text-xs font-black text-violet-500/50 mb-4 tracking-widest">{h.step}</div>
                  <div className="text-4xl mb-4">{h.icon}</div>
                  <h3 className="font-bold text-xl mb-3">{h.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 pb-24">
          <div className="text-center mb-14">
            <h2 className="text-5xl font-black mb-4">Simple pricing</h2>
            <p className="text-white/40 text-xl">Pay for what you use. No surprises.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$49", period: "/mo", calls: "50 swarm runs/month", features: ["5 swarm templates", "Up to 20 agents per swarm", "Email support", "Community access"], cta: "Start Free", highlight: false },
              { name: "Pro", price: "$99", period: "/mo", calls: "Unlimited swarm runs", features: ["All templates + custom", "Up to 60+ agents", "Priority support", "Team collaboration", "API access"], cta: "Start Free", highlight: true },
              { name: "Enterprise", price: "Custom", period: "", calls: "Everything in Pro", features: ["Dedicated instances", "Custom agent training", "SLA guarantee", "Slack support", "On-premise option"], cta: "Contact Us", highlight: false },
            ].map((p) => (
              <div key={p.name} className={`rounded-3xl p-8 border transition-all relative ${p.highlight ? "bg-violet-500/10 border-violet-500/40 shadow-2xl shadow-violet-500/20" : "glass border-violet-500/10"}`}>
                {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-xs font-bold rounded-full">Most Popular</div>}
                <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                <div className="mb-1">
                  <span className="text-5xl font-black gradient-text">{p.price}</span>
                  <span className="text-white/40">{p.period}</span>
                </div>
                <p className="text-sm text-white/40 mb-6">{p.calls}</p>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                      <span className="text-violet-400">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className={`block text-center py-3 rounded-xl font-bold transition-all ${p.highlight ? "btn-primary" : "glass border border-violet-500/20 hover:border-violet-500/40"}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-6">7-day free trial. No credit card required.</p>
        </section>

        {/* Early access CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="glass rounded-3xl p-14 border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/5" />
            <div className="relative">
              <div className="text-6xl mb-6 animate-float">🌊</div>
              <h2 className="text-4xl font-black mb-4">Ready to flow?</h2>
              <p className="text-white/50 mb-8 text-lg">Deploy your first agent swarm in 60 seconds. Free to start.</p>
              {!submitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-5 py-4 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                  />
                  <button
                    onClick={() => setSubmitted(true)}
                    className="px-8 py-4 btn-primary rounded-xl font-bold whitespace-nowrap"
                  >
                    Get Early Access
                  </button>
                </div>
              ) : (
                <div className="text-violet-400 font-semibold text-lg">
                  ✅ You're on the list! We'll be in touch soon.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-violet-500/10 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-black">E</div>
              <span className="font-bold text-white/50">EddyFlow</span>
              <span>— AI Agent Swarm Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#swarms" className="hover:text-white/60 transition-colors">Swarms</a>
              <a href="#how" className="hover:text-white/60 transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-white/60 transition-colors">Pricing</a>
              <Link href="/auth" className="hover:text-white/60 transition-colors">Sign in</Link>
            </div>
            <div>Built with 🌊 by <strong className="text-white/40">Edward Elisha</strong></div>
          </div>
        </footer>

      </div>
    </main>
  );
}
