'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { copy, languageLabels, type Language, t } from '@/lib/i18n';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

const CITIES = [
  { slug: 'beijing', name: 'Beijing',  meta: 'Forbidden City' },
  { slug: 'xian',    name: "Xi'an",    meta: 'Terracotta Army' },
  { slug: 'suzhou',  name: 'Suzhou',   meta: 'Classical Gardens' },
];

const LANGUAGES: Language[] = ['en', 'zh', 'ar'];

interface NavbarProps {
  initialLanguage: Language;
}

export default function Navbar({ initialLanguage }: NavbarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<Language | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.user) setUser(data.user); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.refresh();
  }

  async function handleLanguageChange(nextLanguage: Language) {
    setPendingLanguage(nextLanguage);
    await fetch('/api/preferences/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: nextLanguage }),
    });
    router.refresh();
  }

  const lang = pendingLanguage ?? initialLanguage;
  const currentLang = languageLabels[lang];
  const navbarCopy = copy.navbar;

  return (
    <nav className="fixed top-0 w-full z-[1000] py-3 border-b border-[#D4AF37]/20 backdrop-blur-xl bg-[rgba(10,0,0,0.95)]">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 font-[Cinzel,serif] text-[22px] font-bold text-[#D4AF37] no-underline tracking-wide whitespace-nowrap"
        >
          <span className="text-[28px] anim-glow">🏯</span>
          <span>{t(navbarCopy.brand, lang)}</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/#home" className="nav-link text-white/85 no-underline font-medium text-[15px] tracking-[0.5px]">{t(navbarCopy.home, lang)}</Link>
          <Link href="/#about" className="nav-link text-white/85 no-underline font-medium text-[15px] tracking-[0.5px]">{t(navbarCopy.about, lang)}</Link>
          <Link href="/#explore" className="nav-link text-white/85 no-underline font-medium text-[15px] tracking-[0.5px]">{t(navbarCopy.explore, lang)}</Link>
          <Link href="/#marvels" className="nav-link text-white/85 no-underline font-medium text-[15px] tracking-[0.5px]">{t(navbarCopy.marvels, lang)}</Link>
          <Link href="/#treasures" className="nav-link text-white/85 no-underline font-medium text-[15px] tracking-[0.5px]">{t(navbarCopy.treasures, lang)}</Link>

          {/* Language selector — CSS hover trigger via .lang-selector / .lang-dropdown */}
          <div className="lang-selector">
            <button className="flex items-center gap-2 text-white/85 text-[14px] bg-white/[0.06] border border-[#D4AF37]/25 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">
              <i className="fas fa-globe text-[#D4AF37]" />
              <span>{currentLang.flag} {currentLang.label}</span>
              <i className="fas fa-chevron-down text-[10px]" />
            </button>
            <div className="lang-dropdown bg-[rgba(10,0,0,0.98)] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
              {LANGUAGES.map((languageCode) => (
                <a
                  key={languageCode}
                  href="#"
                  className="flex items-center gap-3 px-5 py-3 text-white/85 text-[14px] no-underline transition-all duration-200 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                  onClick={(e) => { e.preventDefault(); handleLanguageChange(languageCode); }}
                >
                  <span>{languageLabels[languageCode].flag}</span>
                  <span>{languageLabels[languageCode].label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* City dropdown — state toggle via .city-menu.open */}
          <div className="relative" ref={cityRef}>
            <button
              onClick={() => setCityOpen((v) => !v)}
              className="flex items-center gap-2 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-full px-5 py-2 font-semibold text-[14px] border-none cursor-pointer transition-all duration-300 hover:shadow-[0_4px_15px_rgba(187,30,30,0.4)] hover:-translate-y-0.5"
            >
              <span>{t(navbarCopy.selectCity, lang)}</span>
              <i className="fas fa-chevron-down text-[10px]" />
            </button>
            <div className={`city-menu absolute top-[calc(100%+10px)] left-0 w-[260px] bg-[rgba(10,0,0,0.98)] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]${cityOpen ? ' open' : ''}`}>
              <div className="px-5 py-3 text-[#D4AF37] text-[11px] uppercase tracking-[2px] font-semibold border-b border-[#D4AF37]/15">
                {t(navbarCopy.chooseCity, lang)}
              </div>
              {CITIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}`}
                  onClick={() => setCityOpen(false)}
                  className="flex items-center justify-between px-5 py-3.5 text-white/85 no-underline text-[14px] transition-all duration-200 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                >
                  <span>{c.name}</span>
                  <span className="text-white/40 text-[12px]">{t(navbarCopy.cityMeta[c.slug as keyof typeof navbarCopy.cityMeta], lang)}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Auth area */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={user.role === 'admin' ? '/admin' : '/account'}
                className="text-[#FFD700] text-[14px] no-underline bg-white/[0.08] border border-[#D4AF37]/25 rounded-full px-4 py-1.5 transition-all duration-300 hover:border-[#D4AF37]/55"
              >
                {user.role === 'admin' ? t(navbarCopy.admin, lang) : t(navbarCopy.account, lang)}
              </Link>
              <span className="text-[#D4AF37] text-[14px] font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-white/70 text-[13px] border border-white/20 rounded-full px-4 py-1.5 cursor-pointer transition-all duration-300 hover:border-[#BB1E1E] hover:text-[#BB1E1E] bg-transparent"
              >
                {t(navbarCopy.logout, lang)}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-white/80 text-[14px] no-underline border border-white/20 rounded-full px-4 py-1.5 transition-all duration-300 hover:border-[#D4AF37]/50 hover:text-[#D4AF37]">{t(navbarCopy.login, lang)}</Link>
              <Link href="/signup" className="text-[#FFD700] text-[14px] no-underline bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] rounded-full px-4 py-1.5 font-semibold transition-all duration-300 hover:-translate-y-0.5">{t(navbarCopy.signup, lang)}</Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-[2px] bg-[#D4AF37] transition-all duration-300${mobileOpen ? ' rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#D4AF37] transition-all duration-300${mobileOpen ? ' opacity-0' : ''}`} />
          <span className={`block w-6 h-[2px] bg-[#D4AF37] transition-all duration-300${mobileOpen ? ' -rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* Mobile nav — .mobile-nav.open controls visibility */}
      <div className={`mobile-nav${mobileOpen ? ' open' : ''}`}>
        <Link href="/#home" className="nav-link text-white/85 no-underline font-medium text-[15px]" onClick={() => setMobileOpen(false)}>{t(navbarCopy.home, lang)}</Link>
        <Link href="/#about" className="nav-link text-white/85 no-underline font-medium text-[15px]" onClick={() => setMobileOpen(false)}>{t(navbarCopy.about, lang)}</Link>
        <Link href="/#explore" className="nav-link text-white/85 no-underline font-medium text-[15px]" onClick={() => setMobileOpen(false)}>{t(navbarCopy.explore, lang)}</Link>
        <Link href="/#marvels" className="nav-link text-white/85 no-underline font-medium text-[15px]" onClick={() => setMobileOpen(false)}>{t(navbarCopy.marvels, lang)}</Link>
        <Link href="/#treasures" className="nav-link text-white/85 no-underline font-medium text-[15px]" onClick={() => setMobileOpen(false)}>{t(navbarCopy.treasures, lang)}</Link>
        <div className="flex gap-2 pt-2 border-t border-[#D4AF37]/20">
          {user ? (
            <>
              <Link href={user.role === 'admin' ? '/admin' : '/account'} className="text-[#FFD700] text-[14px] no-underline border border-[#D4AF37]/25 rounded-full px-4 py-2" onClick={() => setMobileOpen(false)}>
                {user.role === 'admin' ? t(navbarCopy.admin, lang) : t(navbarCopy.account, lang)}
              </Link>
              <button onClick={handleLogout} className="text-white/70 text-[14px] border border-white/20 rounded-full px-4 py-2 cursor-pointer bg-transparent">
                {t(navbarCopy.logout, lang)} ({user.name})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/80 text-[14px] no-underline border border-white/20 rounded-full px-4 py-2" onClick={() => setMobileOpen(false)}>{t(navbarCopy.login, lang)}</Link>
              <Link href="/signup" className="text-[#FFD700] text-[14px] no-underline bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] rounded-full px-4 py-2 font-semibold" onClick={() => setMobileOpen(false)}>{t(navbarCopy.signup, lang)}</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
