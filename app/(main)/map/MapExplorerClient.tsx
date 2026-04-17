'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { InfoWindow, Map, Marker, NavigationControl } from 'react-bmapgl';

import { copy, getLanguageDirection, type Language, t } from '@/lib/i18n';

type CitySummary = {
  id: number;
  slug: string;
  name: string;
  center_lat: number | string | null;
  center_lng: number | string | null;
  zoom_level: number | string | null;
};

type LandmarkSummary = {
  id: number;
  slug: string;
  city_slug: string;
  city_name: string;
  name: string;
  category: string;
  latitude: number | string | null;
  longitude: number | string | null;
  short_description: string | null;
  description: string | null;
  historical_background: string | null;
};

function toNum(v: number | string | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return isNaN(n) ? null : n;
}

const DEFAULT_CENTER = { lng: 116.402544, lat: 39.928216 };
const DEFAULT_ZOOM = 5;

export default function MapExplorerClient({ language }: { language: Language }) {
  const mapCopy = copy.map;
  const searchParams = useSearchParams();

  const initialCitySlug = searchParams.get('city') ?? '';
  const initialLandmarkSlug = searchParams.get('landmark') ?? '';

  const [cities, setCities] = useState<CitySummary[]>([]);
  const [landmarks, setLandmarks] = useState<LandmarkSummary[]>([]);
  const [selectedCitySlug, setSelectedCitySlug] = useState(initialCitySlug);
  const [activeLandmarkSlug, setActiveLandmarkSlug] = useState(initialLandmarkSlug);

  // Load cities
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/cities?lang=${language}`)
      .then((r) => r.json())
      .then((json: { data?: CitySummary[] }) => {
        if (!cancelled) setCities(
          (json.data ?? []).map((c) => ({
            ...c,
            center_lat: toNum(c.center_lat),
            center_lng: toNum(c.center_lng),
            zoom_level: toNum(c.zoom_level),
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [language]);

  // Resolve effective city
  const effectiveCitySlug =
    (selectedCitySlug && cities.find((c) => c.slug === selectedCitySlug)?.slug) ||
    (initialCitySlug && cities.find((c) => c.slug === initialCitySlug)?.slug) ||
    cities[0]?.slug ||
    '';

  // Load landmarks when city changes
  useEffect(() => {
    if (!effectiveCitySlug) return;
    let cancelled = false;
    fetch(`/api/landmarks?lang=${language}&city=${encodeURIComponent(effectiveCitySlug)}`)
      .then((r) => r.json())
      .then((json: { data?: LandmarkSummary[] }) => {
        if (!cancelled) setLandmarks(
          (json.data ?? []).map((l) => ({
            ...l,
            latitude: toNum(l.latitude),
            longitude: toNum(l.longitude),
          }))
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [effectiveCitySlug, language]);

  const effectiveActiveLandmarkSlug =
    (activeLandmarkSlug && landmarks.find((l) => l.slug === activeLandmarkSlug)?.slug) ||
    (initialLandmarkSlug &&
      effectiveCitySlug === initialCitySlug &&
      landmarks.find((l) => l.slug === initialLandmarkSlug)?.slug) ||
    landmarks[0]?.slug ||
    '';

  const selectedCity = cities.find((c) => c.slug === effectiveCitySlug) ?? null;
  const activeLandmark = landmarks.find((l) => l.slug === effectiveActiveLandmarkSlug) ?? null;

  const mapCenter =
    activeLandmark && typeof activeLandmark.longitude === 'number' && typeof activeLandmark.latitude === 'number'
      ? { lng: activeLandmark.longitude, lat: activeLandmark.latitude }
      : selectedCity && typeof selectedCity.center_lng === 'number' && typeof selectedCity.center_lat === 'number'
        ? { lng: selectedCity.center_lng, lat: selectedCity.center_lat }
        : DEFAULT_CENTER;

  const mapZoom = activeLandmark
    ? Math.max(Number(selectedCity?.zoom_level ?? 10), 15)
    : Number(selectedCity?.zoom_level ?? DEFAULT_ZOOM);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (effectiveCitySlug) params.set('city', effectiveCitySlug);
    else params.delete('city');
    if (effectiveActiveLandmarkSlug) params.set('landmark', effectiveActiveLandmarkSlug);
    else params.delete('landmark');

    const next = params.toString();
    const current = window.location.search.replace(/^\?/, '');
    if (next !== current) {
      const nextUrl = next ? `${window.location.pathname}?${next}` : window.location.pathname;
      window.history.replaceState(window.history.state, '', nextUrl);
    }
  }, [effectiveCitySlug, effectiveActiveLandmarkSlug]);

  return (
    <section
      dir={getLanguageDirection(language)}
      className="min-h-screen bg-[linear-gradient(135deg,#fff7ec_0%,#f5e4cc_48%,#eedbc4_100%)] px-4 pb-16 pt-28 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8">
        <div>
          <p className="mb-3 font-[Cinzel,serif] text-sm uppercase tracking-[4px] text-[#8b0000]/70">
            {t(mapCopy.eyebrow, language)}
          </p>
          <h1 className="mb-4 font-[Cinzel,serif] text-4xl font-bold text-[#1a0000] sm:text-5xl">
            {t(mapCopy.title, language)}
          </h1>
          <p className="text-[17px] leading-8 text-[#5a3a2a]">{t(mapCopy.description, language)}</p>
        </div>

        <div className="grid items-stretch gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="flex h-[760px] min-h-0 flex-col rounded-[28px] border border-[#d4af37]/20 bg-white/75 p-5 shadow-[0_20px_40px_rgba(139,69,19,0.12)] backdrop-blur max-md:h-[560px]">
            <div className="mb-6">
              <h2 className="mb-3 font-[Cinzel,serif] text-2xl font-bold text-[#1a0000]">
                {t(mapCopy.cities, language)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setSelectedCitySlug(city.slug);
                      setActiveLandmarkSlug('');
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      city.slug === effectiveCitySlug
                        ? 'bg-[linear-gradient(135deg,#BB1E1E,#8B0000)] text-[#FFD700] shadow-[0_12px_24px_rgba(139,0,0,0.25)]'
                        : 'border border-[#d4af37]/25 bg-[#fff7eb] text-[#8b4513] hover:border-[#d4af37]/60 hover:text-[#8b0000]'
                    }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <h2 className="mb-4 font-[Cinzel,serif] text-2xl font-bold text-[#1a0000]">
                {t(mapCopy.landmarks, language)}
              </h2>

              <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                {landmarks.length === 0 ? (
                  <div className="rounded-[18px] border border-dashed border-[#d4af37]/30 bg-[#fff7eb] px-4 py-5 text-sm leading-7 text-[#8b4513]">
                    {t(mapCopy.noLandmarks, language)}
                  </div>
                ) : (
                  landmarks.map((landmark) => {
                    const isActive = landmark.slug === effectiveActiveLandmarkSlug;
                    return (
                      <button
                        key={landmark.id}
                        type="button"
                        onClick={() => setActiveLandmarkSlug(landmark.slug)}
                        className={`block w-full rounded-[20px] border px-4 py-4 text-left transition-all duration-200 ${
                          isActive
                            ? 'border-[#d4af37]/60 bg-[linear-gradient(135deg,#8b0000,#5a0000)] text-[#fff3d6] shadow-[0_18px_36px_rgba(139,0,0,0.24)]'
                            : 'border-[#d4af37]/18 bg-white/80 text-[#1a0000] hover:-translate-y-0.5 hover:border-[#d4af37]/45 hover:shadow-[0_16px_32px_rgba(139,69,19,0.12)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-[Cinzel,serif] text-[22px] font-bold">{landmark.name}</h3>
                            <p
                              className={`mt-1 text-xs uppercase tracking-[2px] ${
                                isActive ? 'text-[#ffd86d]' : 'text-[#8b0000]/70'
                              }`}
                            >
                              {landmark.category}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              isActive ? 'bg-white/12 text-[#fff3d6]' : 'bg-[#fff4dc] text-[#8b4513]'
                            }`}
                          >
                            {t(mapCopy.focusLandmark, language)}
                          </span>
                        </div>
                        <p className={`mt-3 text-sm leading-7 ${isActive ? 'text-white/80' : 'text-[#5a3a2a]'}`}>
                          {landmark.short_description ?? landmark.description ?? landmark.historical_background}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          <div className="relative overflow-hidden rounded-[32px] border border-[#d4af37]/20 bg-[#2b140b] shadow-[0_28px_60px_rgba(26,0,0,0.28)]">
            <Map
              center={mapCenter as unknown as BMapGL.Point}
              zoom={mapZoom}
              enableScrollWheelZoom
              style={{ height: '760px', width: '100%' }}
            >
              <NavigationControl />
              {landmarks.map((landmark) =>
                typeof landmark.longitude === 'number' && typeof landmark.latitude === 'number' ? (
                  <Marker
                    key={landmark.id}
                    position={{ lng: landmark.longitude, lat: landmark.latitude }}
                    onClick={() => setActiveLandmarkSlug(landmark.slug)}
                  />
                ) : null
              )}
              {activeLandmark &&
              typeof activeLandmark.longitude === 'number' &&
              typeof activeLandmark.latitude === 'number' ? (
                <InfoWindow
                  position={{ lng: activeLandmark.longitude, lat: activeLandmark.latitude }}
                  title={activeLandmark.name}
                  text={activeLandmark.short_description ?? activeLandmark.description ?? ''}
                />
              ) : null}
            </Map>
          </div>
        </div>
      </div>
    </section>
  );
}
