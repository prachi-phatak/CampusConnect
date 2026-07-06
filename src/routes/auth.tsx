import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkle } from "@/components/site/Sparkle";
import { createClient } from "@/lib/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — CampusConnect" },
      { name: "description", content: "Sign in or create a CampusConnect account to run your college club." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (signUpError) throw signUpError;
        router.navigate({ to: "/dashboard" });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-cream px-4 py-16">
      <Sparkle className="absolute left-8 top-8" size={20} />
      <Sparkle className="absolute right-8 top-8" size={20} />
      <Sparkle className="absolute bottom-8 left-8" size={16} />
      <Sparkle className="absolute bottom-8 right-8" size={16} />
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-block font-display text-2xl font-bold">
          CAMPUS<span className="bg-black px-1 text-cream">CONNECT</span>
        </Link>
        <div className="neu-border bg-white p-8">
          <p className="eyebrow mb-2 font-bold">{mode === "signin" ? "Welcome back" : "Get started"}</p>
          <h1 className="mb-6 text-3xl font-bold">
            {mode === "signin" ? "Sign in to CampusConnect" : "Create your account"}
          </h1>
          {error && (
            <div className="mb-4 bg-red-100 p-2 font-mono text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Full name" type="text" name="fullName" placeholder="Ada Lovelace" required />
            )}
            <Field label="College email" type="email" name="email" placeholder="you@college.edu" required />
            <Field label="Password" type="password" name="password" placeholder="********" required />
            <button
              type="submit"
              disabled={loading}
              className="neu-border neu-press w-full bg-black px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider text-cream disabled:opacity-50"
            >
              {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-[2px] flex-1 bg-black" />
            <span className="eyebrow font-bold">or</span>
            <div className="h-[2px] flex-1 bg-black" />
          </div>
          <button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="neu-border neu-press w-full bg-white px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider disabled:opacity-50"
          >
            Continue with Google
          </button>
          <p className="mt-6 text-center font-mono text-xs">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="font-bold underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type, name, placeholder, required }: { label: string; type: string; name: string; placeholder: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block font-bold">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="w-full border-0 border-b-2 border-black bg-transparent px-1 py-2 font-mono text-sm outline-none focus:bg-lime/40"
      />
    </label>
  );
}