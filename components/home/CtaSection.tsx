import { copy, type Language, t } from '@/lib/i18n';

export default function CtaSection({ language }: { language: Language }) {
  const homeCopy = copy.home;

  return (
    <section
      id="treasures"
      className="anim-gradient dot-pattern relative py-[120px] overflow-hidden"
      style={{ background: 'linear-gradient(-45deg, #8B0000, #1a0000, #3d0000, #000000)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5 relative z-[1]">
        <div className="text-center max-w-[700px] mx-auto">
          <p className="deco-underline font-[Playfair_Display,serif] text-base text-[#D4AF37] font-light tracking-[3px] uppercase mb-10">
            {t(homeCopy.journeyEyebrow, language)}
          </p>
          <h2 className="font-[Cinzel,serif] text-[44px] font-bold text-white mb-6">
            {t(homeCopy.journeyTitle, language)}
          </h2>
          <p className="text-white/70 text-[17px] leading-relaxed mb-10">
            {t(homeCopy.journeyDesc, language)}
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-full px-10 py-5 font-semibold text-[16px] no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(187,30,30,0.5)]"
          >
            <i className="fas fa-compass" />
            {t(homeCopy.beginJourney, language)}
          </a>
          <p className="text-white/40 text-[13px] mt-5">{t(homeCopy.freeToJoin, language)}</p>
        </div>
      </div>
    </section>
  );
}
