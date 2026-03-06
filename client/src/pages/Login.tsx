import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoggingIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      if (user.role === 'admin') setLocation('/admin');
      else if (user.role === 'seller') setLocation('/seller');
      else setLocation('/');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-3xl p-10 border border-border shadow-2xl">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 text-primary">
          <LogIn className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-8">Enter your credentials to access your account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-background"
            />
          </div>
          <button 
            disabled={isLoggingIn}
            type="submit" 
            className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="font-bold text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
