"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0a0010] text-white flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-600/8 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm font-black">E</div>
            <span className="font-black text-xl">EddyFlow</span>
          </Link>
          <h1 className="text-3xl font-black mb-2">
            {mode === "signup" ? "Start for free" : "Welcome back"}
          </h1>
          <p className="text-white/40">
            {mode === "signup" ? "Launch your first swarm in 60 seconds" : "Good to see you again"}
          </p>
        </div>

        <div className="glass rounded-3xl p-8 border border-violet-500/20">
          {/* Toggle */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-8">
            {(["signup", "signin"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-violet-600 text-white" : "text-white/40 hover:text-white"}`}>
                {m === "signup" ? "Sign up" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm text-white/50 mb-2 block">Full name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Edward Elisha"
                  className="w-full px-4 py-3.5 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
              </div>
            )}
            <div>
              <label className="text-sm text-white/50 mb-2 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>
            <div>
              <label className="text-sm text-white/50 mb-2 block">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-white/5 border border-violet-500/20 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-all" />
            </div>

            <button type="submit"
              className="w-full py-4 btn-primary rounded-xl font-bold text-base mt-2">
              {mode === "signup" ? "Create account →" : "Sign in →"}
            </button>
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            {mode === "signup" ? "Already have an account? " : "No account yet? "}
            <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="text-violet-400 hover:underline">
              {mode === "signup" ? "Sign in" : "Sign up free"}
            </button>
          </p>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}
