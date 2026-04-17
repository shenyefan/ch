import Link from 'next/link';
import { sql } from '@/lib/db';
import { copy, type Language, t } from '@/lib/i18n';

interface City {
  id: number;
  slug: string;
  name: string;
  subtitle: string | null;
  description: string;
  short_bio?: string | null;
  image_url: string | null;
  avg_rating: number;
  review_count: number;
}

async function getCities(language: Language): Promise<City[]> {
  try {
    const rows = await sql<City>`
      SELECT
        c.id,
        c.slug,
        c.featured_image AS image_url,
        COALESCE((
          SELECT ROUND(AVG(r.rating)::numeric, 1)
          FROM reviews r
          WHERE r.city_id = c.id AND r.status = 'approved' AND r.rating IS NOT NULL
        ), 0)::float8 AS avg_rating,
        (
          SELECT COUNT(*)::int
          FROM reviews r
          WHERE r.city_id = c.id AND r.status = 'approved'
        ) AS review_count,
        ct.name,
        ct.subtitle,
        ct.short_bio,
        ct.description
      FROM cities c
      JOIN city_translations ct ON ct.city_id = c.id AND ct.language = ${language}
      WHERE c.is_active = TRUE
      ORDER BY c.sort_order ASC, c.id ASC
      LIMIT 3
    `;
    return rows;
  } catch {
    return [];
  }
}

export default async function CitiesSection({ language }: { language: Language }) {
  const cities = await getCities(language);
  const homeCopy = copy.home;

  return (
    <section
      id="explore"
      className="py-[100px]"
      style={{ background: 'linear-gradient(135deg, #0a0000 0%, #1a0000 100%)' }}
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-16">
          <h2 className="font-[Cinzel,serif] text-[40px] font-bold mb-4 grad-text-gold">{t(homeCopy.featuredCities, language)}</h2>
          <p className="text-white/60 text-[17px] max-w-[600px] mx-auto">
            {t(homeCopy.featuredCitiesDesc, language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cities.map((city) => {
            const cardImage = city.image_url;
            return (
              <div key={city.id} className="tutor-card bg-white/[0.04] rounded-3xl border border-[#D4AF37]/[0.18] transition-all duration-300 hover:-translate-y-[10px] hover:border-[#D4AF37]/40 overflow-hidden">
                <Link href={`/cities/${city.slug}`} className="block relative z-10 no-underline">
                  {cardImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cardImage}
                      alt={city.name}
                      className="w-full h-[220px] object-cover"
                    />
                  )}
                  <div className="p-8 relative z-10">
                    <h3 className="font-[Cinzel,serif] text-[22px] font-bold text-white mb-1">{city.name}</h3>
                    <p className="text-[#D4AF37] text-[13px] uppercase tracking-[1px] mb-3">
                      {city.subtitle ?? t(homeCopy.historicCity, language)}
                    </p>
                    {city.review_count > 0 ? (
                      <div className="flex items-center gap-2 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`${i < Math.floor(city.avg_rating) ? 'fas fa-star' : 'fas fa-star-half-alt'} text-[#D4AF37] text-[13px]`}
                          />
                        ))}
                        <span className="text-[#D4AF37] text-[13px] font-semibold ml-1">{city.avg_rating.toFixed(1)}</span>
                        <span className="text-white/40 text-[12px]">({city.review_count} {t(homeCopy.reviews, language)})</span>
                      </div>
                    ) : null}
                    <p className="text-white/60 text-[14px] leading-relaxed mb-6 line-clamp-3">
                      {city.short_bio ?? city.description}
                    </p>
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#BB1E1E] to-[#8B0000] text-[#FFD700] rounded-full px-5 py-2.5 font-semibold text-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(187,30,30,0.4)]">
                      {`${t(homeCopy.visitCity, language)} ${city.name}`} <i className="fas fa-arrow-right" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
