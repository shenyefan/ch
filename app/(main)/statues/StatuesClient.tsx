'use client';

import { useState } from 'react';
import { copy, t, type Language } from '@/lib/i18n';

export default function StatuesClient({ language }: { language: Language }) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const s = copy.statues;

  const toggle = (i: number) =>
    setFlipped((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <section
      className="min-h-screen py-20 px-5"
      style={{ background: 'linear-gradient(-45deg, #8B0000, #1a0000, #3d0000, #000000)' }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-[Cinzel,serif] text-[#D4AF37] text-sm tracking-[3px] uppercase mb-4">
            {t(s.eyebrow, language)}
          </p>
          <h1 className="font-[Cinzel,serif] text-[36px] md:text-[48px] font-bold text-white mb-6 leading-tight">
            {t(s.title, language)}
          </h1>
          <p className="text-white/65 text-[16px] leading-relaxed max-w-[760px] mx-auto">
            {t(s.subtitle, language)}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {s.items.map((item, i) => (
            <div
              key={i}
              className="h-[400px] cursor-pointer"
              style={{ perspective: '1000px' }}
              onClick={() => toggle(i)}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: flipped.has(i) ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden border border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    background: 'linear-gradient(135deg, rgba(139,0,0,0.92), rgba(26,0,0,0.92))',
                  }}
                >
                  <div className="relative flex-1 overflow-hidden">
                    <img
                      src={`https://files.suki.icu/ch/images/statues/${item.image}`}
                      alt={t(item.title, language)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between shrink-0">
                    <h4 className="font-[Cinzel,serif] text-[#D4AF37] font-semibold text-[15px] leading-snug">
                      {t(item.title, language)}
                    </h4>
                    <i className="fas fa-sync-alt text-[#D4AF37]/40 text-xs" />
                  </div>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl border border-[#D4AF37]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-7 overflow-y-auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(135deg, rgba(26,0,0,0.97), rgba(100,0,0,0.97))',
                  }}
                >
                  <div className="w-10 h-[2px] bg-[#D4AF37]/40 mb-5 shrink-0" />
                  <h4 className="font-[Cinzel,serif] text-[#D4AF37] font-semibold text-[14px] text-center mb-4 shrink-0">
                    {t(item.title, language)}
                  </h4>
                  <p className="text-white/75 text-[13px] leading-relaxed text-center">
                    {t(item.desc, language)}
                  </p>
                  <div className="w-10 h-[2px] bg-[#D4AF37]/40 mt-5 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-white/30 text-xs tracking-widest mt-10">
          {t(s.flipHint, language)}
        </p>
      </div>
    </section>
  );
}
