import { copy, type Language, t } from '@/lib/i18n';

const MARVELS = [
  {
    icon: 'fas fa-chess-rook',
    key: 'imperial',
    href: '/cities/beijing',
    city: 'Beijing',
    featured: false,
  },
  {
    icon: 'fas fa-place-of-worship',
    key: 'military',
    href: '/cities/xian',
    city: "Xi'an",
    featured: true,
  },
  {
    icon: 'fas fa-leaf',
    key: 'gardens',
    href: '/cities/suzhou',
    city: 'Suzhou',
    featured: false,
  },
 ] as const;

export default function MarvelsSection({ language }: { language: Language }) {
  const homeCopy = copy.home;

  return (
    <section
      id="marvels"
      className="py-[100px]"
      style={{ background: 'linear-gradient(135deg, #fff9f0 0%, #fdf0e0 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-[Cinzel,serif] text-[40px] font-bold mb-4 grad-text-rg">{t(homeCopy.marvelsTitle, language)}</h2>
          <p className="text-[#1a0000]/60 text-[17px] max-w-[600px] mx-auto">
            {t(homeCopy.marvelsDesc, language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {MARVELS.map((m) => {
            const marvelCopy = homeCopy.marvels[m.key];

            return <div
              key={m.key}
              className={`relative rounded-3xl p-10 border transition-all duration-300 hover:-translate-y-2 ${
                m.featured
                  ? 'scale-105 border-[#D4AF37]/50 shadow-[0_30px_60px_rgba(187,30,30,0.2)]'
                  : 'bg-white border-[#BB1E1E]/10 shadow-[0_20px_40px_rgba(187,30,30,0.08)]'
              }`}
              style={m.featured ? { background: 'linear-gradient(135deg, #1a0000, #3d0000)' } : {}}
            >
              {'badge' in marvelCopy && marvelCopy.badge ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#BB1E1E] to-[#D4AF37] text-white px-6 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[1px] whitespace-nowrap">
                  {t(marvelCopy.badge, language)}
                </div>
              ) : null}
              <div className={`w-[80px] h-[80px] rounded-full flex items-center justify-center mx-auto mb-6 ${m.featured ? 'bg-[#D4AF37]/20' : 'bg-gradient-to-br from-[#BB1E1E] to-[#8B0000]'}`}>
                <i className={`${m.icon} ${m.featured ? 'text-[#D4AF37]' : 'text-[#FFD700]'} text-[30px]`} />
              </div>
              <h3 className={`font-[Cinzel,serif] text-[22px] font-bold text-center mb-6 ${m.featured ? 'text-white' : 'text-[#1a0000]'}`}>
                {t(marvelCopy.title, language)}
              </h3>
              <ul className="list-none p-0 m-0 mb-8 flex flex-col gap-3">
                {marvelCopy.features[language].map((f) => (
                  <li key={f} className={`flex items-center gap-3 text-[14px] ${m.featured ? 'text-white/80' : 'text-[#1a0000]/70'}`}>
                    <i className="fas fa-check text-[#D4AF37] text-[12px] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="text-center">
                <a
                  href={m.href}
                  className={`inline-flex items-center gap-2 rounded-full px-7 py-3 font-semibold text-[14px] no-underline transition-all duration-300 hover:-translate-y-0.5 ${
                    m.featured
                      ? 'border-2 border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37]/10'
                      : 'bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] hover:shadow-[0_4px_15px_rgba(187,30,30,0.4)]'
                  }`}
                >
                  {`${t(homeCopy.visitCity, language)} ${m.city}`} <i className="fas fa-arrow-right" />
                </a>
              </div>
            </div>
          })}
        </div>
      </div>
    </section>
  );
}
