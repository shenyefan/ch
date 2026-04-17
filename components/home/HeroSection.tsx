import { copy, type Language, t } from '@/lib/i18n';

export default function HeroSection({ language }: { language: Language }) {
  const heroCopy = copy.home;

  return (
    <section
      id="home"
      className="anim-gradient dot-pattern relative min-h-screen flex items-center pt-[80px] overflow-hidden"
      style={{ background: 'linear-gradient(-45deg, #8B0000, #1a0000, #3d0000, #000000)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5 grid grid-cols-1 md:grid-cols-2 gap-[60px] items-center relative z-[1] w-full">

        {/* Left: text */}
        <div>
          <p className="deco-underline anim-fade-in font-[Playfair_Display,serif] text-base text-[#D4AF37] font-light tracking-[3px] uppercase mb-8">
            {t(heroCopy.heroEyebrow, language)}
          </p>
          <h1 className="anim-slide-up font-[Cinzel,serif] text-[50px] font-bold leading-tight text-white [text-shadow:0_4px_20px_rgba(0,0,0,0.4)] mt-7 mb-6">
            <span>{t(heroCopy.heroTitleLine1, language)}</span>
            <br />
            <span className="grad-text-hero">{t(heroCopy.heroTitleLine2, language)}</span>
          </h1>
          <p className="anim-fade-in-delay text-white/70 text-[17px] leading-relaxed mb-10">
            {t(heroCopy.heroDescription, language)}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-10">
            <a
              href={`/game/index.html?lang=${language}`}
              className="flex items-center gap-2 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-full px-8 py-4 font-semibold text-[15px] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(187,30,30,0.4)]"
            >
              <i className="fas fa-gamepad" />
              {t(heroCopy.playGame, language)}
            </a>
            <a
              href="#explore"
              className="flex items-center gap-2 border-2 border-white/20 text-white/80 rounded-full px-8 py-4 font-semibold text-[15px] no-underline transition-all duration-300 hover:border-white/40 hover:text-white hover:-translate-y-0.5"
            >
              <i className="fas fa-compass" />
              {t(heroCopy.exploreCities, language)}
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-3 flex-wrap">
            {[
              { number: '3', label: t(heroCopy.historicCities, language) },
              { number: '5,000+', label: t(heroCopy.yearsOfHistory, language) },
              { number: '12+', label: t(heroCopy.iconicLandmarks, language) },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-[#D4AF37]/[0.08] backdrop-blur-[10px] px-6 py-[18px] rounded-[20px] border border-[#D4AF37]/25"
              >
                <div className="font-[Cinzel,serif] text-[28px] font-bold grad-text-gold">{s.number}</div>
                <div className="text-white/60 text-[12px] uppercase tracking-[1px] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: video */}
        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-2 border-[#D4AF37]/25 h-[650px] group">
          <video
            src="https://files.suki.icu/ch/videos/archi.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="anim-bounce absolute bottom-8 left-1/2 -translate-x-1/2 text-[#D4AF37]/60 text-xl">
        <i className="fas fa-chevron-down" />
      </div>

      {/* Decorative floating circles */}
      <div className="anim-float-1 absolute w-[300px] h-[300px] bg-[#D4AF37]/[0.06] rounded-full pointer-events-none hidden md:block" style={{ top: '10%', right: '5%' }} />
      <div className="anim-float-2 absolute w-[200px] h-[200px] bg-[#BB1E1E]/[0.06] rounded-full pointer-events-none hidden md:block" style={{ bottom: '20%', right: '15%' }} />
      <div className="anim-float-3 absolute w-[150px] h-[150px] bg-[#D4AF37]/[0.04] rounded-full pointer-events-none hidden md:block" style={{ top: '50%', right: '30%' }} />
    </section>
  );
}
