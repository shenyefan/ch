import Link from 'next/link';
import { copy, type Language, t } from '@/lib/i18n';

const STEPS = [
  {
    icon: 'fas fa-search',
    key: 'discover',
  },
  {
    icon: 'fas fa-map-marked-alt',
    key: 'explore',
  },
  {
    icon: 'fas fa-landmark',
    key: 'uncover',
  },
 ] as const;

export default function AboutSection({ language }: { language: Language }) {
  const homeCopy = copy.home;

  return (
    <section
      id="about"
      className="py-[100px]"
      style={{ background: 'linear-gradient(135deg, #fff9f0 0%, #fdf0e0 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-[Cinzel,serif] text-[40px] font-bold mb-4 grad-text-rg">{t(homeCopy.immerse, language)}</h2>
          <p className="text-[#1a0000]/60 text-[17px] max-w-[600px] mx-auto">
            {t(homeCopy.immerseDesc, language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step) => {
            const translation = homeCopy.aboutSteps[step.key];
            const cardClassName = 'step-card block text-center px-[30px] py-10 bg-white rounded-3xl shadow-[0_20px_40px_rgba(187,30,30,0.08)] transition-all duration-300 hover:-translate-y-[10px]';
            const content = (
              <>
                <div className="w-[90px] h-[90px] bg-gradient-to-br from-[#BB1E1E] to-[#8B0000] rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className={`${step.icon} text-[#FFD700] text-[32px]`} />
                </div>
                <h3 className="font-[Cinzel,serif] text-[20px] font-bold text-[#1a0000] mb-4">{t(translation.title, language)}</h3>
                <p className="text-[#1a0000]/60 text-[15px] leading-relaxed">{t(translation.desc, language)}</p>
              </>
            );

            if (step.key === 'explore') {
              return (
                <Link key={step.key} href="/map" className={cardClassName}>
                  {content}
                </Link>
              );
            }

            return (
              <div key={step.key} className={cardClassName}>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
