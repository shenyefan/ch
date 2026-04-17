import { notFound } from 'next/navigation';
import { copy, type Language, t } from '@/lib/i18n';
import { getPreferredLanguage } from '@/lib/i18n-server';

import CityDetailClient, {
  type CityFeatureCard,
  type CityFeatureChapter,
  type CityLandmark,
} from './CityDetailClient';

interface CityDetail {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  short_bio: string | null;
  description: string | null;
  featured_image: string | null;
  hero_video_url: string | null;
  gallery_images: string[] | null;
  landmarks: CityLandmark[];
}

interface CityApiResponse {
  data: CityDetail;
}

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

function normalizeGallery(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function getCity(slug: string, language: Language): Promise<CityDetail | null> {
  const json = await fetchJson<CityApiResponse>(`/api/cities/${slug}?lang=${language}`);
  if (!json?.data) {
    return null;
  }

  return {
    ...json.data,
    gallery_images: normalizeGallery(json.data.gallery_images),
    landmarks: json.data.landmarks ?? [],
  };
}

async function getFeatures(slug: string, language: Language): Promise<CityFeatureCard[]> {
  const json = await fetchJson<CityFeatureCard[] | { data: CityFeatureCard[] }>(`/api/cities/${slug}/features?lang=${language}`);
  if (!json) {
    return [];
  }

  return Array.isArray(json) ? json : json.data ?? [];
}

async function getChapters(modalSlug: string, language: Language): Promise<CityFeatureChapter[]> {
  const json = await fetchJson<CityFeatureChapter[] | { data: CityFeatureChapter[] }>(`/api/features/${modalSlug}/chapters?lang=${language}`);
  const rows = Array.isArray(json) ? json : json?.data ?? [];

  return rows.map((chapter) => ({
    ...chapter,
    images: normalizeGallery(chapter.images),
    paragraphs: Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.length > 0)
      : [],
  }));
}

function buildFallbackFeatures(city: CityDetail, language: Language): CityFeatureCard[] {
  return city.landmarks.slice(0, 3).map((landmark, index) => {
    const paragraphs = [
      landmark.description ?? landmark.short_description,
      landmark.historical_background,
      landmark.visiting_tips ? `${t(copy.city.visitingTips, language)}: ${landmark.visiting_tips}` : null,
    ].filter((paragraph): paragraph is string => Boolean(paragraph));

    return {
      id: landmark.id,
      slug: `${city.slug}-${landmark.slug}-feature`,
      card_image: landmark.featured_image,
      interactive_url: null,
      statues_url: null,
      modal_slug: `${landmark.slug}-modal`,
      sort_order: index + 1,
      title: landmark.name,
      description: landmark.short_description ?? landmark.description,
      chapters: [
        {
          id: landmark.id,
          slug: `${landmark.slug}-chapter`,
          images: landmark.featured_image ? [landmark.featured_image] : [],
          sort_order: 1,
          title: landmark.name,
          paragraphs,
        },
      ],
    };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = await getPreferredLanguage();
  const city = await getCity(slug, language);

  return {
    title: city ? `${city.name} | Chinese Heritage` : 'City | Chinese Heritage',
    description: city?.short_bio ?? 'Chinese Heritage city page',
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const language = await getPreferredLanguage();
  const city = await getCity(slug, language);

  if (!city) {
    notFound();
  }

  const featureRows = await getFeatures(slug, language);
  const featuresWithChapters = await Promise.all(
    featureRows.map(async (feature) => ({
      ...feature,
      chapters: feature.modal_slug ? await getChapters(feature.modal_slug, language) : [],
    }))
  );

  const features = featuresWithChapters.length > 0 ? featuresWithChapters : buildFallbackFeatures(city, language);
  const heroImage = city.featured_image;
  const heroVideo = city.hero_video_url;
  const galleryImages = city.gallery_images ?? [];

  return (
    <CityDetailClient
      citySlug={city.slug}
      cityName={city.name}
      citySubtitle={city.subtitle}
      cityBio={city.short_bio}
      cityDescription={city.description}
      heroImage={heroImage}
      heroVideo={heroVideo}
      galleryImages={galleryImages}
      features={features}
      landmarks={city.landmarks}
      language={language}
    />
  );
}