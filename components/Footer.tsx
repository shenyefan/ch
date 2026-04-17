import Link from 'next/link';
import { copy, type Language, t } from '@/lib/i18n';

export default function Footer({ language }: { language: Language }) {
  const footerCopy = copy.footer;
  const navbarCopy = copy.navbar;

  return (
    <footer className="footer-bar bg-black text-white pt-[60px] pb-6">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-10">

          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[32px]">🏯</span>
              <span className="font-[Cinzel,serif] text-[18px] font-bold text-[#D4AF37]">{t(navbarCopy.brand, language)}</span>
            </div>
            <p className="text-white/60 text-[14px] leading-relaxed mb-6">
              {t(footerCopy.about, language)}
            </p>
            <div className="flex gap-3">
              {[
                { href: '#', icon: 'fab fa-twitter',   label: 'Twitter' },
                { href: '#', icon: 'fab fa-instagram', label: 'Instagram' },
                { href: '#', icon: 'fab fa-youtube',   label: 'YouTube' },
                { href: '#', icon: 'fab fa-weixin',    label: 'WeChat' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full bg-white/[0.06] border border-[#D4AF37]/20 flex items-center justify-center text-white/60 text-[15px] transition-all duration-300 hover:bg-[#BB1E1E] hover:border-[#BB1E1E] hover:text-white hover:-translate-y-1"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-[Cinzel,serif] text-[14px] font-bold text-[#D4AF37] uppercase tracking-[2px] mb-5">{t(footerCopy.quickLinks, language)}</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { href: '/#home',      label: t(navbarCopy.home, language) },
                { href: '/#about',     label: t(navbarCopy.about, language) },
                { href: '/#explore',   label: t(footerCopy.exploreCities, language) },
                { href: '/#marvels',   label: t(navbarCopy.marvels, language) },
                { href: '/#treasures', label: t(navbarCopy.treasures, language) },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 text-[14px] no-underline transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore Cities */}
          <div>
            <h4 className="font-[Cinzel,serif] text-[14px] font-bold text-[#D4AF37] uppercase tracking-[2px] mb-5">{t(footerCopy.exploreCities, language)}</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              {[
                { href: '/cities/beijing', label: 'Beijing' },
                { href: '/cities/xian',    label: "Xi'an" },
                { href: '/cities/suzhou',  label: 'Suzhou' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 text-[14px] no-underline transition-all duration-300 hover:text-[#D4AF37] hover:translate-x-1 inline-block">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[Cinzel,serif] text-[14px] font-bold text-[#D4AF37] uppercase tracking-[2px] mb-5">{t(footerCopy.contact, language)}</h4>
            <ul className="list-none p-0 m-0 flex flex-col gap-3">
              <li>
                <a href="mailto:info@chinese-heritage.com" className="flex items-center gap-2 text-white/60 text-[14px] no-underline transition-all duration-300 hover:text-[#D4AF37]">
                  <i className="fas fa-envelope text-[#D4AF37]" />
                  info@chinese-heritage.com
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-white/60 text-[14px] no-underline transition-all duration-300 hover:text-[#D4AF37]">
                  <i className="fas fa-globe text-[#D4AF37]" />
                  chinese-heritage.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <p className="text-white/40 text-[13px]">
            &copy; {new Date().getFullYear()} {t(navbarCopy.brand, language)}. {t(footerCopy.rights, language)}
          </p>
          <div className="flex gap-6">
            {[t(footerCopy.privacy, language), t(footerCopy.terms, language), t(footerCopy.cookies, language)].map((l) => (
              <a key={l} href="#" className="text-white/40 text-[13px] no-underline transition-all duration-300 hover:text-[#D4AF37]">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
