'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { copy, type Language, t } from '@/lib/i18n';

export interface CityFeatureChapter {
  id: number;
  slug: string;
  images: string[];
  sort_order: number;
  title: string | null;
  paragraphs: string[];
}

export interface CityFeatureCard {
  id: number;
  slug: string;
  card_image: string | null;
  interactive_url: string | null;
  statues_url: string | null;
  modal_slug: string | null;
  sort_order: number;
  title: string;
  description: string | null;
  chapters: CityFeatureChapter[];
}

export interface CityLandmark {
  id: number;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  historical_background: string | null;
  visiting_tips: string | null;
  featured_image: string | null;
  category: string;
  is_featured: boolean;
}

interface CityDetailClientProps {
  citySlug: string;
  cityName: string;
  citySubtitle: string | null;
  cityBio: string | null;
  cityDescription: string | null;
  heroImage: string | null;
  heroVideo: string | null;
  galleryImages: string[];
  features: CityFeatureCard[];
  landmarks: CityLandmark[];
  language: Language;
}

export default function CityDetailClient({
  citySlug,
  cityName,
  citySubtitle,
  cityBio,
  cityDescription,
  heroImage,
  heroVideo,
  galleryImages,
  features,
  landmarks,
  language,
}: CityDetailClientProps) {
  const cityCopy = copy.city;
  const [activeFeature, setActiveFeature] = useState<CityFeatureCard | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [chapterDirection, setChapterDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    if (!activeFeature) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeFeature]);

  const repeatedGallery = galleryImages.length > 0 ? [...galleryImages, ...galleryImages] : [];
  const activeChapter = activeFeature ? activeFeature.chapters[activeChapterIndex] ?? null : null;
  const hasPreviousChapter = activeChapterIndex > 0;
  const hasNextChapter = activeFeature ? activeChapterIndex < activeFeature.chapters.length - 1 : false;

  const handlePreviousChapter = () => {
    if (!hasPreviousChapter) {
      return;
    }

    setChapterDirection('backward');
    setActiveChapterIndex((currentIndex) => currentIndex - 1);
  };

  const handleNextChapter = () => {
    if (!hasNextChapter) {
      return;
    }

    setChapterDirection('forward');
    setActiveChapterIndex((currentIndex) => currentIndex + 1);
  };

  const handleOpenFeature = (feature: CityFeatureCard) => {
    setChapterDirection('forward');
    setActiveChapterIndex(0);
    setActiveFeature(feature);
  };

  const handleCloseFeature = () => {
    setActiveFeature(null);
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden bg-[#1a0000]">
        {heroVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroImage ?? undefined}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={heroImage} alt={cityName} className="absolute inset-0 h-full w-full object-cover" />
        ) : null}

        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,0,0,0.08),rgba(26,0,0,0.12))]" />
        <div className="dot-pattern absolute inset-0" />

        <div className="relative z-10 flex min-h-screen items-end justify-center px-6 pb-20 pt-32 text-center">
          <div className="max-w-[840px]">
            <p className="mb-5 font-[Cinzel,serif] text-[13px] uppercase tracking-[4px] text-[#FFD700]/80">
              {citySubtitle ?? t(cityCopy.heritage, language)}
            </p>
            <h1 className="mb-6 font-[Cinzel,serif] text-[54px] font-bold leading-none text-white md:text-[88px]">
              {cityName}
            </h1>
            <p className="mx-auto mb-10 max-w-[720px] font-[Playfair_Display,serif] text-[18px] italic leading-8 text-[#fff3d6] md:text-[22px]">
              {cityBio}
            </p>
          </div>
        </div>
      </section>

      {repeatedGallery.length > 0 && (
        <section className="overflow-hidden bg-[linear-gradient(135deg,rgba(139,0,0,0.05),rgba(26,0,0,0.1))] py-2">
          <div className="relative h-[300px] overflow-hidden bg-black/10 max-md:h-[250px]">
            <div className="city-carousel-track absolute flex w-max gap-[30px] px-[30px] py-0">
              {repeatedGallery.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="relative h-[300px] w-[280px] shrink-0 overflow-hidden rounded-[15px] border-[3px] border-[#D4AF37] shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all duration-300 hover:z-10 hover:scale-105 hover:shadow-[0_12px_35px_rgba(212,175,55,0.4)] max-md:h-[160px] max-md:w-[220px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={`${cityName} gallery ${index + 1}`} className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(139,0,0,0.92),transparent)] px-4 pb-3 pt-6 text-center text-[13px] font-semibold text-[#FFD700]">
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section
        id="city-features"
        className="bg-[linear-gradient(135deg,#fff9f0_0%,#fdf0e0_100%)] px-5 py-[30px]"
      >
        <div className="mx-auto w-full max-w-[1280px]">
          <h2 className="mb-5 text-center font-[Cinzel,serif] text-[44px] font-bold grad-text-gold max-md:text-[36px]">
            {t(cityCopy.immerseTitle, language)}
          </h2>
          <p className="mx-auto mb-14 max-w-[760px] text-center font-[Playfair_Display,serif] text-[19px] text-[#5a3a2a]">
            {t(cityCopy.immerseDesc, language)}
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {features.map((feature) => {
              const canOpenModal = feature.chapters.length > 0;

              return (
                <div
                  key={feature.id}
                  className="rounded-[24px] border border-[#D4AF37]/15 bg-white px-5 pb-10 pt-12 text-center shadow-[0_15px_35px_rgba(187,30,30,0.08)] transition-all duration-300 hover:-translate-y-[10px] hover:border-[#D4AF37]/40 hover:shadow-[0_25px_50px_rgba(187,30,30,0.25)] md:px-6"
                >
                  {feature.card_image ?? heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={feature.card_image ?? heroImage ?? undefined}
                      alt={feature.title}
                      className="mb-6 h-[200px] w-full rounded-[10px] object-cover"
                    />
                  ) : null}
                  <h3 className="mb-5 font-[Cinzel,serif] text-[30px] font-bold text-[#1a0000]">
                    {feature.title}
                  </h3>
                  <p className="mb-8 font-[Playfair_Display,serif] leading-8 text-[#5a3a2a]">
                    {feature.description}
                  </p>

                  <div className="flex flex-nowrap items-center justify-center gap-2 pt-1">
                      {canOpenModal ? (
                        <button
                          type="button"
                          onClick={() => handleOpenFeature(feature)}
                          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] px-3 py-2.5 text-[11px] font-semibold leading-none text-[#FFD700] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(187,30,30,0.45)] lg:px-4 lg:text-[12px]"
                        >
                          {t(cityCopy.readMore, language)}
                        </button>
                      ) : null}

                      {feature.interactive_url ? (
                        <a
                          href={feature.interactive_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-[#D4AF37]/30 bg-[linear-gradient(135deg,#2c3e50,#34495e)] px-3 py-2.5 text-[11px] font-semibold leading-none text-[#FFD700] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/55 hover:shadow-[0_12px_30px_rgba(44,62,80,0.4)] lg:px-4 lg:text-[12px]"
                        >
                          {t(cityCopy.visualInteractive, language)}
                        </a>
                      ) : null}

                      {feature.statues_url ? (
                        <a
                          href={feature.statues_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border-2 border-[#D4AF37]/30 bg-[linear-gradient(135deg,#4b2a16,#6f3f1f)] px-3 py-2.5 text-[11px] font-semibold leading-none text-[#FFD700] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/55 hover:shadow-[0_12px_30px_rgba(111,63,31,0.35)] lg:px-4 lg:text-[12px]"
                        >
                          {t(cityCopy.exploreStatues, language)}
                        </a>
                      ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {landmarks.length > 0 && (
        <section className="bg-[linear-gradient(135deg,#0a0000,#1a0000)] px-5 py-20">
          <div className="mx-auto max-w-[1180px]">
            <h2 className="mb-10 text-center font-[Cinzel,serif] text-[36px] font-bold grad-text-gold">
              {t(cityCopy.landmarks, language)}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {landmarks.map((landmark) => (
                <article
                  key={landmark.id}
                  className="rounded-[18px] border border-[#D4AF37]/20 bg-white/[0.04] p-5 text-[#fff4dc]"
                >
                  {landmark.featured_image ?? heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={landmark.featured_image ?? heroImage ?? undefined}
                      alt={landmark.name}
                      className="mb-4 h-[180px] w-full rounded-[12px] object-cover"
                    />
                  ) : null}
                  <h3 className="mb-2 font-[Cinzel,serif] text-[22px] text-white">{landmark.name}</h3>
                  <p className="mb-3 text-sm uppercase tracking-[1.5px] text-[#D4AF37]">{landmark.category}</p>
                  <p className="text-[14px] leading-7 text-white/70">
                    {landmark.short_description ?? landmark.description}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={`/map?city=${encodeURIComponent(citySlug)}&landmark=${encodeURIComponent(landmark.slug)}`}
                      className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/40 bg-white/10 px-4 py-2 text-sm font-semibold text-[#FFD700] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/70 hover:bg-white/15"
                    >
                      {t(cityCopy.viewOnMap, language)}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="city-about" className="bg-[linear-gradient(135deg,#fff9f0,#fef5e4)] px-5 py-20">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="mb-8 font-[Cinzel,serif] text-[38px] font-bold grad-text-rg">{t(cityCopy.aboutCity, language)} {cityName}</h2>
          <p className="font-[Playfair_Display,serif] text-[18px] leading-9 text-[#5a3a2a]">
            {cityDescription}
          </p>
          <div className="mt-10">
            <Link
              href="/#explore"
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] px-8 py-3 font-semibold text-[#FFD700] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(187,30,30,0.45)]"
            >
              {t(cityCopy.backToCities, language)}
            </Link>
          </div>
        </div>
      </section>

      {activeFeature ? (
        <div
          className="fixed inset-0 z-[10000] bg-black/90 px-4 py-4 md:px-6 md:py-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseFeature();
            }
          }}
        >
          <div className="mx-auto flex h-full max-w-[970px] items-center justify-center">
            <div className="relative flex h-full max-h-[calc(100vh-32px)] w-full flex-col overflow-hidden rounded-[20px] border-2 border-[#D4AF37]/30 bg-[linear-gradient(135deg,rgba(139,0,0,0.95),rgba(26,0,0,0.95))] p-8 text-[#FFD700] shadow-[0_20px_60px_rgba(0,0,0,0.55)] md:max-h-[calc(100vh-48px)] md:p-10">
              <button
                type="button"
                onClick={handleCloseFeature}
                className="absolute right-5 top-5 text-[34px] leading-none text-[#FFD700] transition-transform duration-300 hover:scale-110 hover:text-[#ff8e8e]"
                aria-label={t(cityCopy.closeModal, language)}
              >
                &times;
              </button>

              <h2 className="mb-8 shrink-0 text-center font-[Cinzel,serif] text-[36px] font-bold max-md:pr-10 max-md:text-[30px]">
                {activeFeature.title}
              </h2>

              <div className="min-h-0 flex-1">
                <div className="flex h-full min-h-0 flex-col rounded-[15px] border-2 border-[#d4af37] bg-[linear-gradient(135deg,#fef5e4,#fff3e2)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] md:p-8">
                  <div className="mb-6 shrink-0 flex items-center justify-between gap-4 border-b border-[#d4af37]/30 pb-4 max-md:flex-col max-md:items-start">
                    <div>
                      <p className="mb-2 text-[12px] font-semibold uppercase tracking-[3px] text-[#bb1e1e]/70">
                        {t(cityCopy.chapter, language)} {String(activeChapterIndex + 1).padStart(2, '0')}
                      </p>
                      <p className="font-[Playfair_Display,serif] text-[15px] italic text-[#8b4513]">
                        {activeFeature.chapters.length} {t(cityCopy.pagesOfStories, language)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-end max-md:self-start">
                      <button
                        type="button"
                        onClick={handlePreviousChapter}
                        disabled={!hasPreviousChapter}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/40 bg-white/80 text-[20px] text-[#8b4513] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#bb1e1e]/45 hover:text-[#bb1e1e] hover:shadow-[0_10px_24px_rgba(187,30,30,0.18)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        aria-label={t(cityCopy.previousChapter, language)}
                      >
                        <span aria-hidden="true">&lt;</span>
                      </button>
                      <span className="min-w-[72px] text-center font-[Cinzel,serif] text-[18px] font-semibold text-[#8b4513]">
                        {String(activeChapterIndex + 1).padStart(2, '0')} / {String(activeFeature.chapters.length).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextChapter}
                        disabled={!hasNextChapter}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/40 bg-white/80 text-[20px] text-[#8b4513] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#bb1e1e]/45 hover:text-[#bb1e1e] hover:shadow-[0_10px_24px_rgba(187,30,30,0.18)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                        aria-label={t(cityCopy.nextChapter, language)}
                      >
                        <span aria-hidden="true">&gt;</span>
                      </button>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    {activeChapter ? (
                      <div
                        key={activeChapter.id}
                        className={`grid items-start gap-8 overflow-hidden rounded-[18px] border border-[#d4af37]/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(255,248,236,0.96))] p-4 shadow-[inset_0_0_0_1px_rgba(212,175,55,0.08)] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] md:p-5 ${chapterDirection === 'forward' ? 'anim-page-turn-forward' : 'anim-page-turn-backward'}`}
                      >
                        <div className="space-y-4">
                          {(activeChapter.images.length > 0
                            ? activeChapter.images
                            : [activeFeature.card_image ?? heroImage].filter((image): image is string => Boolean(image))
                          ).map((image, index) => (
                            <div
                              key={`${activeChapter.id}-${image}-${index}`}
                              className="group relative overflow-hidden rounded-[16px] bg-[#f5e9d4] shadow-[0_18px_40px_rgba(139,69,19,0.16)]"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={image}
                                alt={activeChapter.title ?? activeFeature.title}
                                className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 max-md:max-h-[280px] md:max-h-[440px]"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(26,0,0,0.08)_100%)]" />
                            </div>
                          ))}
                        </div>

                        <div className="rounded-[16px] bg-[linear-gradient(180deg,rgba(255,255,255,0.55),rgba(255,247,233,0.92))] px-5 py-6 max-md:px-2">
                          {activeChapter.title ? (
                            <h3 className="mb-5 font-[Cinzel,serif] text-[30px] font-bold leading-tight text-[#8b4513] max-md:text-[24px]">
                              {activeChapter.title}
                            </h3>
                          ) : null}
                          <div className="space-y-4">
                            {activeChapter.paragraphs.map((paragraph, index) => (
                              <p
                                key={`${activeChapter.id}-paragraph-${index}`}
                                className="font-[Playfair_Display,serif] text-[16px] leading-8 text-[#5a3a2a]"
                              >
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}