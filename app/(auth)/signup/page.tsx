'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required.';
    if (!email.includes('@')) errors.email = 'Please enter a valid email.';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.');
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { id: 'fullName', label: 'Full Name',        type: 'text',     key: 'name',            value: name,            setter: setName,            placeholder: 'Enter your full name',                 autoComplete: 'name' },
    { id: 'email',   label: 'Email Address',     type: 'email',    key: 'email',           value: email,           setter: setEmail,           placeholder: 'Enter your email',                     autoComplete: 'email' },
    { id: 'pw',      label: 'Password',          type: 'password', key: 'password',        value: password,        setter: setPassword,        placeholder: 'Create a strong password (min 8 chars)', autoComplete: 'new-password' },
    { id: 'cpw',     label: 'Confirm Password',  type: 'password', key: 'confirmPassword', value: confirmPassword, setter: setConfirmPassword, placeholder: 'Confirm your password',                 autoComplete: 'new-password' },
  ] as const;

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
          <h1 className="font-[Cinzel,serif] text-[28px] font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/50 text-[15px]">Join us to explore China&apos;s architectural wonders</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-[#BB1E1E]/20 border border-[#BB1E1E]/40 rounded-xl px-4 py-3 mb-5 text-[#ff6b6b] text-[14px]">
            <i className="fas fa-exclamation-circle" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          {fields.map((f) => (
            <div key={f.id}>
              <label className="block text-white/70 text-[13px] font-medium mb-2 uppercase tracking-[1px]" htmlFor={f.id}>
                {f.label}
              </label>
              <input
                id={f.id}
                type={f.type}
                className={`auth-input w-full bg-white/[0.07] border rounded-xl px-4 py-3.5 text-white text-[15px] transition-all duration-300 ${fieldErrors[f.key] ? 'error border-[#BB1E1E]/60' : 'border-white/15'}`}
                placeholder={f.placeholder}
                value={f.value}
                onChange={(e) => (f.setter as (v: string) => void)(e.target.value)}
                required
                autoComplete={f.autoComplete}
              />
              {fieldErrors[f.key] && (
                <p className="text-[#ff6b6b] text-[12px] mt-1.5 flex items-center gap-1">
                  <i className="fas fa-exclamation-circle text-[10px]" />
                  {fieldErrors[f.key]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-xl font-semibold text-[15px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(187,30,30,0.4)] disabled:opacity-60 disabled:cursor-not-allowed border-none mt-1"
          >
            {loading ? (
              <><i className="fas fa-spinner fa-spin" /> Creating account...</>
            ) : (
              <><i className="fas fa-user-plus" /> Sign Up Now</>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center my-7">
          <div className="flex-1 h-px bg-white/10" />
          <span className="mx-4 text-white/30 text-[11px] uppercase tracking-[2px]">Or sign up with</span>
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
          Already have an account?{' '}
          <Link href="/login" className="text-[#D4AF37] no-underline hover:text-[#FFD700] font-medium transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
