'use client';

import { useEffect, useRef, useState } from 'react';

import { type Language, copy, t } from '@/lib/i18n';

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
};

const SYSTEM_PROMPT =
  'You are an expert AI assistant specializing in Chinese heritage, architecture, and cultural history. ' +
  'You help users learn about Chinese architectural wonders like the Forbidden City, Xi\'an City Wall, and Suzhou gardens. ' +
  'Provide accurate, informative, and engaging responses about Chinese heritage, construction techniques, historical context, and cultural significance. ' +
  'Keep responses concise but informative (max 150 words).';

export default function AiChat({ language }: { language: Language }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: ++idRef.current, role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...messages.map((m) => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content })),
            { role: 'user', content: text },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      const data = await res.json() as { choices?: { message?: { content?: string } }[]; error?: string };
      const reply = data.choices?.[0]?.message?.content ?? data.error ?? 'Sorry, something went wrong.';
      setMessages((prev) => [...prev, { id: ++idRef.current, role: 'ai', content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { id: ++idRef.current, role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const placeholder = t(copy.chat.placeholder, language);

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AI chat"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] shadow-[0_8px_24px_rgba(139,0,0,0.45)] transition-transform hover:scale-110 active:scale-95"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[24px] border border-[#d4af37]/20 bg-white shadow-[0_24px_60px_rgba(26,0,0,0.22)]">
          {/* Header */}
          <div className="flex items-center gap-3 bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFD700]/20">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2">
                <path d="M12 2a5 5 0 1 0 5 5A5 5 0 0 0 12 2zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-14 0v1" />
              </svg>
            </div>
            <div>
              <p className="font-[Cinzel,serif] text-sm font-bold text-[#FFD700]">{t(copy.chat.title, language)}</p>
              <p className="text-[11px] text-white/60">{t(copy.chat.subtitle, language)}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex max-h-[360px] min-h-[180px] flex-col gap-3 overflow-y-auto bg-[#fdf8f2] px-4 py-4">
            {messages.length === 0 && (
              <div className="rounded-[16px] bg-white px-4 py-3 text-sm leading-6 text-[#5a3a2a] shadow-sm">
                {t(copy.chat.welcome, language)}
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[82%] rounded-[16px] px-4 py-3 text-sm leading-6 ${
                    msg.role === 'user'
                      ? 'bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] text-white'
                      : 'bg-white text-[#1a0000] shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-[16px] bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b0000]" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b0000]" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#8b0000]" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-[#d4af37]/15 bg-white px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void send(); } }}
              placeholder={placeholder}
              maxLength={500}
              className="min-w-0 flex-1 rounded-full border border-[#d4af37]/25 bg-[#fdf8f2] px-4 py-2 text-sm text-[#1a0000] outline-none focus:border-[#8b0000]/50"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] text-[#FFD700] transition-opacity disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
