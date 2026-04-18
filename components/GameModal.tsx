'use client';

import { useRef, useState } from 'react';
import { copy, t, type Language } from '@/lib/i18n';
import UnityGame, { type UnityGameHandle } from '@/components/UnityGame';

export default function GameModal({ language }: { language: Language }) {
  const [showIntro, setShowIntro] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const gameRef = useRef<UnityGameHandle>(null);

  const g = copy.game;

  return (
    <>
      {/* Play Button */}
      <button
        onClick={() => setShowIntro(true)}
        className="flex items-center gap-2 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-full px-8 py-4 font-semibold text-[15px] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(187,30,30,0.4)] cursor-pointer border-0"
      >
        <i className="fas fa-gamepad" />
        {t(copy.home.playGame, language)}
      </button>

      {/* Intro Modal */}
      {showIntro && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setShowIntro(false)}
        >
          <div
            className="relative flex flex-col md:flex-row w-[920px] max-w-[95vw] max-h-[90vh] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_30px_80px_rgba(0,0,0,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowIntro(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/50 hover:text-white transition-colors cursor-pointer border-0"
              aria-label="Close"
            >
              <i className="fas fa-times text-xs" />
            </button>
            {/* Left: decorative preview panel */}
            <div className="relative w-full md:w-[52%] min-h-[260px] md:min-h-0 bg-gradient-to-br from-[#1a0000] via-[#2d0000] to-[#000000] overflow-hidden flex items-end">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Decorative arcs */}
              <div className="absolute top-[-60px] left-[-60px] w-[240px] h-[240px] rounded-full border border-[#D4AF37]/15 pointer-events-none" />
              <div className="absolute top-[-30px] left-[-30px] w-[180px] h-[180px] rounded-full border border-[#D4AF37]/10 pointer-events-none" />
              <div className="absolute bottom-[-80px] right-[-80px] w-[280px] h-[280px] rounded-full border border-[#D4AF37]/10 pointer-events-none" />
              {/* Central icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center border border-[#D4AF37]/30"
                  style={{ background: 'rgba(212,175,55,0.08)' }}
                >
                  <i className="fas fa-gamepad text-[#D4AF37] text-3xl" />
                </div>
                <p className="text-[#D4AF37]/50 text-xs tracking-[4px] uppercase font-[Cinzel,serif]">
                  Unity WebGL
                </p>
              </div>
              {/* Bottom caption */}
              <div className="relative z-10 w-full px-6 py-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[#D4AF37]/70 text-xs tracking-widest font-[Cinzel,serif]">
                  {t(g.locationTag, language)}
                </p>
              </div>
            </div>

            {/* Right: info panel */}
            <div className="flex-1 flex flex-col bg-[#0a0000] p-7 md:p-8">
              {/* Title */}
              <h2 className="font-[Cinzel,serif] text-[22px] font-bold text-[#D4AF37] mb-4 leading-tight">
                {t(g.title, language)}
              </h2>

              {/* Description */}
              <p className="text-white/75 text-[14px] leading-relaxed mb-5">{t(g.desc, language)}</p>

              {/* Controls */}
              <p className="text-white/65 text-[14px] leading-relaxed">
                <span className="font-bold text-white/90">{t(g.controlsLabel, language)}</span>
                {t(g.controls, language)}
              </p>

              {/* Spacer */}
              <div className="flex-1 min-h-[24px]" />

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowIntro(false);
                    setShowGame(true);
                  }}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#c9a22e] active:bg-[#b8911e] text-[#1a0000] font-bold py-3 px-4 rounded-lg transition-colors text-[13px] tracking-widest cursor-pointer border-0"
                >
                  {t(g.enter, language)}
                </button>
                <button
                  onClick={() => setShowIntro(false)}
                  className="flex-1 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 active:bg-[#D4AF37]/20 font-bold py-3 px-4 rounded-lg transition-colors text-[13px] tracking-widest cursor-pointer bg-transparent"
                >
                  {t(g.exit, language)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game iframe Modal */}
      {showGame && (
        <div
          className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setShowGame(false)}
        >
          <div
            className="relative flex flex-col w-[1100px] max-w-[96vw] rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_30px_80px_rgba(0,0,0,0.95)] bg-[#0a0000]"
            style={{ height: 'min(680px, 90vh)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-5 py-2.5 bg-[#0a0000] border-b border-[#D4AF37]/20 shrink-0">
              <div className="flex items-center gap-3">
                <i className="fas fa-gamepad text-[#D4AF37] text-sm" />
                <span className="text-[#D4AF37] font-semibold text-sm font-[Cinzel,serif] tracking-wide">
                  {t(g.title, language)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => gameRef.current?.setFullscreen()}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/50 hover:text-white transition-colors cursor-pointer border-0"
                  aria-label="Fullscreen"
                >
                  <i className="fas fa-expand text-xs" />
                </button>
                <button
                  onClick={() => setShowGame(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/70 text-white/50 hover:text-white transition-colors cursor-pointer border-0"
                  aria-label="Close"
                >
                  <i className="fas fa-times text-xs" />
                </button>
              </div>
            </div>

            {/* Game */}
            <div className="flex-1 overflow-hidden">
              <UnityGame ref={gameRef} language={language} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
