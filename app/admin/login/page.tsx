"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to authenticate administrator."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-surface-border bg-surface p-8 sm:p-10">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-surface-border bg-surface-muted text-editorial-100">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-editorial-50">
            Portfolio CMS Access
          </h1>
          <p className="text-xs text-editorial-400">
            Sign in with administrator credentials to manage portfolio content.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-editorial-300">
              Admin Email
            </label>
            <div className="relative mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@enioluwa.design"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 pl-10 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
              />
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-editorial-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-editorial-300">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-surface-border bg-surface-muted px-4 py-3 pl-10 text-sm text-editorial-100 placeholder:text-editorial-600 focus:border-editorial-300 focus:outline-none"
              />
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-editorial-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-editorial-100 py-3 text-xs font-semibold text-background transition-all hover:bg-white disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to CMS"}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
