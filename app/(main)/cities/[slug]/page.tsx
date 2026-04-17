import { notFound } from 'next/navigation';
import { copy, type Language, t } from '@/lib/i18n';
import { getPreferredLanguage } from '@/lib/i18n-server';
import { sql } from '@/lib/db';

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

function normalizeGallery(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string' && item.length > 0);
}

async function getCity(slug: string, language: Language): Promise<CityDetail | null> {
  try {
    const [city] = await sql`
      SELECT
        c.id, c.slug, c.featured_image, c.hero_video_url, c.gallery_images,
        ct.name, ct.subtitle, ct.short_bio, ct.description
      FROM cities c
      JOIN city_translations ct ON ct.city_id = c.id AND ct.language = ${language}
      WHERE c.slug = ${slug} AND c.is_active = TRUE
    `;
    if (!city) return null;

    const landmarks = await sql<CityLandmark>`
      SELECT
        lm.id, lm.slug, lm.latitude, lm.longitude, lm.category,
        lm.featured_image, lm.is_featured, lm.sort_order,
        lt.name, lt.short_description, lt.description,
        lt.historical_background, lt.visiting_tips
      FROM landmarks lm
      JOIN landmark_translations lt ON lt.landmark_id = lm.id AND lt.language = ${language}
      WHERE lm.city_id = ${city.id} AND lm.is_active = TRUE
      ORDER BY lm.sort_order ASC, lm.id ASC
    `;

    return {
      ...(city as CityDetail),
      gallery_images: normalizeGallery(city.gallery_images),
      landmarks,
    };
  } catch {
    return null;
  }
}

async function getFeatures(slug: string, language: Language): Promise<CityFeatureCard[]> {
  try {
    const rows = await sql<CityFeatureCard>`
      SELECT
        f.id, f.slug, f.card_image, f.interactive_url, f.statues_url,
        f.modal_slug, f.sort_order, t.title, t.description
      FROM city_features f
      JOIN city_feature_translations t ON t.feature_id = f.id AND t.language = ${language}
      JOIN cities c ON c.id = f.city_id
      WHERE c.slug = ${slug} AND f.is_active = TRUE
      ORDER BY f.sort_order
    `;
    return rows;
  } catch {
    return [];
  }
}

async function getChapters(modalSlug: string, language: Language): Promise<CityFeatureChapter[]> {
  try {
    const rows = await sql`
      SELECT
        ch.id, ch.slug, ch.images, ch.sort_order, t.title, t.paragraphs
      FROM feature_chapters ch
      JOIN feature_chapter_translations t ON t.chapter_id = ch.id AND t.language = ${language}
      WHERE ch.modal_slug = ${modalSlug}
      ORDER BY ch.sort_order
    `;
    return rows.map((chapter) => ({
      ...(chapter as CityFeatureChapter),
      images: normalizeGallery(chapter.images),
      paragraphs: Array.isArray(chapter.paragraphs)
        ? chapter.paragraphs.filter((paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.length > 0)
        : [],
    }));
  } catch {
    return [];
  }
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