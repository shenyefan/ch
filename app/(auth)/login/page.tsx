'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.');
        return;
      }

      if (userType === 'admin' && data.user?.role !== 'admin') {
        setError('Access denied. This account does not have admin privileges.');
        await fetch('/api/auth/logout', { method: 'POST' });
        return;
      }

      router.push(data.user?.role === 'admin' ? '/admin' : '/');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="anim-gradient min-h-screen flex items-center justify-center relative p-10"
      style={{ background: 'linear-gradient(-45deg, #8B0000, #1a0000, #3d0000, #000000)' }}
    >
      <Link
        href="/"
        className="absolute top-5 left-5 flex items-center gap-2 text-[#D4AF37] no-underline font-medium z-[10] transition-all duration-300 hover:text-[#FFD700] hover:-translate-x-1"
      >
        <i className="fas fa-arrow-left" />
        Back to Home
      </Link>

      <div className="bg-[rgba(10,0,0,0.95)] rounded-3xl p-12 max-w-[500px] w-full border border-[#D4AF37]/25 shadow-[0_30px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 font-[Cinzel,serif] text-[20px] font-bold text-[#D4AF37] no-underline mb-6">
            <span className="text-[30px]">🏯</span>
            Chinese-Heritage
          </Link>
          <h1 className="font-[Cinzel,serif] text-[28px] font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/50 text-[15px]">Sign in to continue your journey</p>
        </div>

        {/* User / Admin toggle */}
        <div className="flex bg-white/[0.05] rounded-xl p-1 mb-7 gap-1">
          {(['user', 'admin'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-300 cursor-pointer border-none ${
                userType === type
                  ? 'bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700]'
                  : 'text-white/50 hover:text-white/80 bg-transparent'
              }`}
            >
              <i className={type === 'user' ? 'fas fa-user' : 'fas fa-user-shield'} />
              {type === 'user' ? 'User' : 'Admin'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-[#BB1E1E]/20 border border-[#BB1E1E]/40 rounded-xl px-4 py-3 mb-5 text-[#ff6b6b] text-[14px]">
            <i className="fas fa-exclamation-circle" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-white/70 text-[13px] font-medium mb-2 uppercase tracking-[1px]" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="auth-input w-full bg-white/[0.07] border border-white/15 rounded-xl px-4 py-3.5 text-white text-[15px] transition-all duration-300"
              placeholder={userType === 'admin' ? 'Enter admin email' : 'Enter your email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-white/70 text-[13px] font-medium mb-2 uppercase tracking-[1px]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-input w-full bg-white/[0.07] border border-white/15 rounded-xl px-4 py-3.5 text-white text-[15px] transition-all duration-300"
              placeholder={userType === 'admin' ? 'Enter admin password' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-white/60 text-[13px] cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[#D4AF37]"
              />
              Remember me
            </label>
            <a href="#" className="text-[#D4AF37] text-[13px] no-underline hover:text-[#FFD700] transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(187,30,30,0.4)] disabled:opacity-60 disabled:cursor-not-allowed border-none mt-1"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin" /> Signing in...</>
            ) : (
              <><i className="fas fa-sign-in-alt" /> Sign In</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center my-7">
          <div className="flex-1 h-px bg-white/10" />
          <span className="mx-4 text-white/30 text-[11px] uppercase tracking-[2px]">Or sign in with</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Social buttons */}
        <div className="flex flex-col gap-3">
          <button type="button" className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-white/15 text-white/70 text-[14px] font-medium bg-white/[0.04] transition-all duration-300 hover:bg-white/[0.08] hover:text-white cursor-pointer">
            <i className="fab fa-google" /> Continue with Google
          </button>
          <button type="button" className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-white/15 text-white/70 text-[14px] font-medium bg-white/[0.04] transition-all duration-300 hover:bg-white/[0.08] hover:text-white cursor-pointer">
            <i className="fab fa-weixin" /> Continue with WeChat
          </button>
        </div>

        <p className="text-center text-white/40 text-[14px] mt-7">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#D4AF37] no-underline hover:text-[#FFD700] font-medium transition-colors">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
